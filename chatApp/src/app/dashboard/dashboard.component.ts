import { Component, OnInit } from '@angular/core';
import { GroupService } from '../services/group.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  public userGroups;
  public otherGroups;

  public groupName = '';
  public showInput = false;

  constructor(
    public group: GroupService,
    public user: UserService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.group.userGroups$.subscribe((val) => {
      this.userGroups = val;
      // console.log(this.userGroups);
    });

    this.group.otherGroups$.subscribe((val) => {
      this.otherGroups = val;
    });
  }

  enterGroup(groupName: string) {
    // console.log(groupName);
    this.router.navigate(['groups', groupName]);
  }

  createGroup(name) {
    this.group.addGroup(name);
  }

  showModal(): void {
    this.showInput = true;
  }

  onSubmit() {
    this.showInput = false;
    if (this.groupName) this.group.addGroup(this.groupName);
    this.groupName = '';
  }

  join(groupName, groupId) {
    this.group.joinGroup(groupName, groupId);
  }
}

//permission to enter a group
//create channels
//ban user
//remove users
//group admin can only administer a group they created
//promotion of users to admins

//leave groups //done
//create groups done
//delete groups
//delete self done

//delete group -> admin or group admin
//remove group from groups array
//remove users from the groups users array

//admin page
//list of groups
//list of all their users
//add user to groups through input
//delete user
