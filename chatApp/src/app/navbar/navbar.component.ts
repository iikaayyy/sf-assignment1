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

  logout() {
    this.user.logout();
    this.router.navigateByUrl('login');
  }
}
