import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user;
  userGroups;
  constructor(public userService: UserService, public group: GroupService) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((val) => {
      this.user = val;
      // console.log(this.user);
    });

    this.group.userGroups$.subscribe((val) => {
      this.userGroups = val;
      // console.log(this.userGroups);
    });
  }

  deleteAccount() {
    this.userService.deleteUser(this.user.id);
  }
}

//delete user from users array
//for each group in users group array
//remove user form that group's user array
