const users = [];

class User {
  roles = [];
  groups = [];
  constructor(username, password, email, id, roles, groups) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.id = id;
    this.roles.push(roles);
    // if (groups) this.groups.push(groups);
  }
}

users.push(new User("super", "123", "super@super.com", users.length + 1, "SU"));
users.push(new User("yashee", "123", "y@y.com", users.length + 1, "GA"));
users.push(new User("john", "123", "j@j.com", users.length + 1, "CA"));

module.exports = users;
