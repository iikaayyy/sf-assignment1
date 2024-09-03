const express = require("express");
const app = express();
const cors = require("cors");
const users = require("./users");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ valid: true });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (user) => username === user.username && password === user.password
  );

  if (!user) return res.json({ valid: false });
  res.json({ valid: true, user });
});

app.listen(3000, () => {
  console.log(`Server listening at port 3000`);
});
