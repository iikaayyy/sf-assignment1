import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  constructor(public router: Router, public user: UserService) {}

  ngOnInit(): void {
    this.user.loggedIn$.subscribe((val) => {
      this.isLoggedIn = val;
    });
  }

  dashboard() {
    console.log('clicked');
    this.router.navigateByUrl('/groups');
  }

  profile() {
    this.router.navigateByUrl('/profile');
    // console.log('logged out');
  }

  logout() {
    this.user.logout();
    // this.router.navigateByUrl('login');
  }
}
