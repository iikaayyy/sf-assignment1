const express = require("express");
const app = express();
const cors = require("cors");
const users = require("./users");
const { groups, createGroup, groupNameAvailable } = require("./groups");

app.use(cors());
app.use(express.json());

// console.log(groups);

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

//Login Route
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
  const { groups: userGroups } = users.at(id - 1);

  //remove user from their groups users array
  for (const groupId of userGroups) {
    const group = groups.find((group) => group.id === groupId);
    const userIdxInGroup = group.users.indexOf(id);
    group.users.splice(userIdxInGroup, 1);
    // console.log(groups);
  }

  //finally delete user
  users.splice(id - 1, 1);
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

// console.log(groups);

app.listen(3000, () => {
  console.log(`Server listening at port 3000`);
});
