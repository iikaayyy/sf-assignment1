export enum UserRole {
  SUPER_USER = 'Super Admin',
  GROUP_ADMIN = 'Group Admin',
  USER = 'Chat User',
}

export interface UserInterface {
  username: string;
  password: string;
  email?: string;
  id: number;
  roles: UserRole[];
  groups?: [];
}

// Super Admin
//Promote user to admin
//remove chat user
//upgrade normal user to super admin role
//All of the functions of a group administrator

//Group Admin
//Create Groups
//Create channels within groups
//Remove channels, users, groups from group they created/administer
//ban a user from channel and report to super admins

//Chat User
//join any channel
//register interest in a group
//leave a group
//delete themselves
//unique username
//logout
