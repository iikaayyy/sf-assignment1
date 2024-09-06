import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private URL = 'http://localhost:3000';

  private groups; //all groups
  private user; //current user

  private userGroups = new BehaviorSubject<any>(undefined);
  userGroups$ = this.userGroups.asObservable();

  private otherGroups = new BehaviorSubject<any>(undefined);
  otherGroups$ = this.otherGroups.asObservable();

  constructor(private http: HttpClient, public userService: UserService) {
    console.log('group service');
    this.getCurrentUser();
  }

  private getCurrentUser() {
    this.userService.user$.subscribe((val) => {
      this.user = val;
      this.assignAllGroups();
    });
  }

  private assignAllGroups() {
    this.http.get(this.URL + '/groups').subscribe((val) => {
      this.groups = val; //get all ghe gorups

      if (typeof window !== 'undefined' && this.user) {
        const userGrps = this.groups.filter((group) =>
          this.user.groups.includes(group.id)
        );
        this.userGroups.next(userGrps);

        const otherGrps = this.groups.filter(
          (group) => !this.user.groups.includes(group.id)
        );
        this.otherGroups.next(otherGrps);
      }
    });
  }

  addGroup(groupName) {
    this.http
      .post(this.URL + '/create-group', {
        name: groupName,
        userId: this.user.id,
      })
      .subscribe((res: any) => {
        if (res.status === 'OK') this.userService.setUser(res.user); //need to update user which will trigger this user to update
      });
  }

  // delete(groupName) {
  //   // console.log(groupName, this.user.id);
  //   this.http
  //     .post(this.URL + '/create-group', {
  //       name: groupName,
  //       userId: this.user.id,
  //     })
  //     .subscribe((res: any) => {
  //       if (res.status === 'OK') this.userService.setUser(res.user); //need to update user which will trigger this user to update
  //     });
  // }

  getGroups() {
    return this.groups;
  }
}
