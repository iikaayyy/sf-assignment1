// export interface UserInterface {
//   username: string;
//   password: string;
//   email?: string;
//   id: number;
//   roles: UserRole[];
//   groups?: [];

//   //join any channel once member of group
//   //register interest in a group
//   //leave group(s)
//   //deleteSelf
// }

class User {
  roles = [];
  groups = [];
  constructor(username, password, email, id, roles, groups) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.id = id;
    this.roles.push(roles);
    if (groups) this.groups.push(groups);
  }
}

const users = [
  new User("super", "123", "super@super.com", 1, "SU"),
  new User("yashee", "123", "y@y.com", 2, "GA"),
  new User("john", "123", "j@j.com", 3, "CA"),
];

module.exports = users;
