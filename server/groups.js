const users = require("./users");
const superAdmin = users[0];

const groups = [];

const groupNameAvailable = (groupName) =>
  groups.every((group) => group.name != groupName);

function createGroup(groupName, adminId) {
  groups.push(
    new Group(groups.length + 1, groupName, ["Main", "Announcements"])
  );
  groups.at(-1).addUser(superAdmin.id);
  groups.at(-1).addUser(adminId);
  // console.log(groups.at(-1));
}

class Group {
  users = [];
  admins = [superAdmin.id]; //super admin is admin by default
  channels = ["Main", "Announcements"];

  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  addAdmin(userId) {
    this.admins.push(userId);
  }

  addUser(userId) {
    if (!this.users.includes(userId)) {
      this.users.push(userId); //add user to group
      // console.log(users.at(-1));
      users.at(userId - 1).groups.push(this.id); //add group to user
    }
  }
}

createGroup("Fitness");
createGroup("Meditation");
createGroup("Programming");

groups.forEach((group) => group.addUser(superAdmin.id)); //add super admin to all groups

groups[0].addUser(2);
groups[1].addUser(2);
groups[2].addUser(3);

// console.log(users);

module.exports = { groups, createGroup, groupNameAvailable };
