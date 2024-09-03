import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';

  constructor(public router: Router, public user: UserService) {}

  ngOnInit(): void {
    this.user.loggedIn$.subscribe((val) => {
      if (val === true) this.router.navigateByUrl('dashboard');
    });
  }

  login() {
    this.user.validateLogin(this.username, this.password).subscribe((res) => {
      if (res.valid) this.user.setUser(res.user);
      this.router.navigateByUrl('dashboard');
    });

    this.username = this.password = '';
  }
}
