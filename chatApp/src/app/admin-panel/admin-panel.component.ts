import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent implements OnInit {
  requests;
  groupRequests;
  currMode;

  constructor(
    private user: UserService,
    private group: GroupService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.user.getRequests().subscribe((res) => {
      this.requests = res;
      // console.log(this.requests);
    });

    this.group.getGroupRequests().subscribe((res) => {
      this.groupRequests = res;
      console.log(this.groupRequests);
    });
  }

  approveRequest(req) {
    this.user.modifyReq(req, 'approve');
    this.user.getRequests().subscribe((res) => {
      this.requests = res;
      // console.log(this.requests);
      this.cdr.detectChanges();
    });
  }

  rejectRequest(req) {
    this.user.modifyReq(req, 'reject');
    this.user.getRequests().subscribe((res) => {
      this.requests = res;
      this.cdr.detectChanges();

      // console.log(this.requests);
    });
  }

  approveGroupRequest(req) {
    this.group.modifyGroupReq('approve', req);
    this.group.getGroupRequests().subscribe((res) => {
      this.groupRequests = res;
      console.log(this.groupRequests);
      this.cdr.detectChanges();
    });
  }

  rejectGroupRequest(req) {
    this.group.modifyGroupReq('reject', req);
    this.group.getGroupRequests().subscribe((res) => {
      this.groupRequests = res;
      console.log(this.groupRequests);
      this.cdr.detectChanges();
    });
  }
}
