const express = require("express");
const path = require("path");
const http = require("http");
const multer = require("multer");
const {
  users,
  createUser,
  requests,
  usernameAvailable,
  groupRequests,
} = require("./users");
const { groups, createGroup, groupNameAvailable } = require("./groups");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/avatars", express.static(path.join(__dirname, "avatars")));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200", // Replace with your client-side URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`${socket.id} just joined!`);

  socket.on("join-room", (data) => {
    // console.log(data);

    socket.join(data.room);
    socket.to(data.room).emit("receive-msg", data);
  });

  socket.on("message", (data) => {
    // console.log(`emitting message: ${m.message}`);
    socket.to(data.room).emit("receive-msg", data);
  });

  socket.on("leave-room", (data) => {
    socket.leave();
    socket.to(data.room).emit("receive-msg", data);
  });

  socket.on("imageMessage", (data) => {
    // Broadcast the image to others in the room
    // console.log(data);
    socket.to(data.room).emit("receive-msg", data);
  });

  socket.on("join-video-room", (data) => {
    data.content = `${data.content} at ${data.time}`;
    socket.to(data.room).emit("receive-msg", data);
  });

  socket.on("leave-video-room", (data) => {
    data.content = `${data.content} at ${data.time}`;
    socket.to(data.room).emit("receive-msg", data);
  });

  socket.on("new-peer", (data) => {
    socket.to(data.room).emit("new-peer", data);
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "avatars"); // Folder to store the uploaded files
  },
  filename: (req, file, cb) => {
    // Wait until Multer has processed the request body
    const ext = path.extname(file.originalname); // Get file extension
    // console.log(file.originalname);
    cb(null, file.originalname); // Save the file with userId in the name
  },
});

const upload = multer({ storage: storage });

app.post("/upload-avatar", upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const userId = Number(req.file.originalname.split(".")[0].split("").pop());
  const ext = req.file.originalname.split(".")[1];
  for (const user of users) {
    if (user.id === userId) {
      user.avatar = `http://localhost:3000/avatars/user${userId}.${ext}`;
    }
  }
  res.json({ status: "upload successfull" });
});

//signUp route
app.post("/sign-up", (req, res) => {
  const { email, username, password } = req.body;
  // console.log(email, password, username);
  //check if username exists in users array
  if (
    !usernameAvailable(users, username) &&
    !usernameAvailable(requests, username)
  ) {
    requests.push({ email, username, password });
    // console.log(requests);
    res.json({ status: "request sent" });
  } else res.json({ status: "fail", message: "username already taken" });
  //check if username exists in requests array
});

app.get("/requests", (req, res) => {
  res.json(requests);
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/join-group", (req, res) => {
  const { userId, groupId, groupName, username } = req.body;
  if (
    !groupRequests.find((g) => g.userId === userId && g.groupId === groupId)
  ) {
    groupRequests.push({ groupName, username, groupId, userId });
  }
  // console.log(groupRequests);
  res.json({ status: "request sent" });
});

app.get("/join-group-reqs", (req, res) => {
  res.json(groupRequests);
});

app.post("/modify-request", (req, res) => {
  const { type, req: request } = req.body;

  const idx = requests.findIndex((r) => r.username === request.username);
  requests.splice(idx, 1);
  if (type === "approve") {
    users.push(createUser(request.username, request.password, request.email));
    console.log(users.at(-1));
    res.json({ status: "added" });
  } else res.json({ status: "denied" });
});

app.post("/modify-group-request", (req, res) => {
  const {
    type,
    request: { userId, groupId },
  } = req.body;
  console.log(type, userId, groupId);

  if (type === "approve") {
    // console.log(users);
    // console.log(users.find((u) => u.id === userId));
    if (!users.find((u) => u.id === userId).groups.includes(groupId)) {
      users.find((u) => u.id === userId).groups.push(groupId);
    }

    // console.log(groups.find((g) => g.id === groupId));
    if (!groups.find((g) => g.id === groupId).users.includes(userId)) {
      groups.find((g) => g.id === groupId).users.push(userId);
    }
  }

  const idx = groupRequests.findIndex(
    (g) => g.userId === userId && g.groupId === groupId
  );

  groupRequests.splice(idx, 1);

  res.json({ status: "progress" });
});

//Login Route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (user) => username === user.username && password === user.password
  );

  if (!user) return res.json({ valid: false });
  res.json({ valid: true, user });
});

//route to return groups
app.get("/groups", (req, res) => {
  res.json(groups);
});

//create Route
app.post("/create-group", (req, res) => {
  const { name, userId: adminId } = req.body;

  if (groupNameAvailable(name)) {
    createGroup(name, adminId);
    const user = users.find((user) => user.id === adminId);
    res.json({ status: "OK", user });
  } else res.json({ status: "fail" });
});

app.post("/delete-user", (req, res) => {
  const { id } = req.body;
  const { groups: userGroups } = users.find((u) => u.id === id);

  const userIdx = users.findIndex((u) => u.id === id);

  //remove user from their groups users array
  for (const groupId of userGroups) {
    const group = groups.find((group) => group.id === groupId);
    const userIdxInGroup = group.users.indexOf(id);
    group.users.splice(userIdxInGroup, 1);
  }

  //finally delete user
  users.splice(userIdx, 1);
  res.json({ status: "ok" });
});

app.post("/remove-user", (req, res) => {
  const { userId, groupId } = req.body;

  //remove userId from group's users array
  const group = groups.find((group) => group.id === groupId);
  const userIdxInGroup = group.users.indexOf(userId);
  group.users.splice(userIdxInGroup, 1);

  //remove groupId from user's groups array
  const groupIndex = users.at(userId - 1).groups.indexOf(groupId);
  users.at(userId - 1).groups.splice(groupIndex, 1);
  res.json({ status: "ok", user: users.at(userId - 1) });
});

server.listen(3000, () => {
  console.log(`Server listening at port 3000`);
});
