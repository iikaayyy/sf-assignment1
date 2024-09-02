import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  super = new User(
    1,
    'super',
    '123',
    'super@s.com',
    UserRole.SUPER_USER,
    'none'
  );
  users = [];
  constructor() {
    this.users.push(this.super);
  }

  validateLogin(username, password) {
    console.log(username, password);
    const user = this.users.find((user) => {
      return user.username === username && user.password === password;
    });

    if (user) return true;
    else return false;
  }

  getUsers() {
    return this.users;
  }
}
