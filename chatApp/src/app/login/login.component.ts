import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(public router: Router, public user: UserService) {}

  login() {
    if (this.user.validateLogin(this.username, this.password))
      console.log('logged in');
    else alert(`Wrong credentials/user doesn't exit. Please try again!`);
    this.username = this.password = '';
  }
}
