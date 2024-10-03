import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket, io } from 'socket.io-client';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnDestroy {
  currUser;
  channelName;
  groupName;
  roomName;
  msgText = '';
  messages = [];
  activeUsers = [];
  socket: Socket;

  constructor(
    private route: ActivatedRoute,
    public user: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //get and parse initial details for sending messages
    this.route.paramMap.subscribe((params) => {
      this.channelName = params.get('channelName');
      this.groupName = params.get('name');
      this.roomName = this.groupName + this.channelName;
    });

    //get the current user
    this.user.user$.subscribe((val) => {
      this.currUser = val;
      console.log(this.currUser.avatar);
    });

    this.socket = io('http://localhost:3000'); //initialize socket

    //connection logic
    this.socket.on('connect', () => {
      const msgObject = this.parseMessage(
        `UPDATE: ${this.currUser.username} joined the channel`,
        'status'
      );

      this.socket.emit('join-room', msgObject);
      this.activeUsers.push(this.currUser.username);
    });

    //message receiving and status handling
    this.socket.on('receive-msg', (m) => {
      if (!this.activeUsers.includes(m.username))
        this.activeUsers.push(m.username);

      if (m.type === 'status' && m.content.split(' ').includes('left')) {
        const idx = this.activeUsers.findIndex((u) => u === m.username);
        idx != -1 ? this.activeUsers.splice(idx, 1) : 'not found';
      }

      this.messages.push(m);
      console.log('receiving', this.messages);
    });
  }

  //cleanup logic -> disconnect socket and emit leave event
  ngOnDestroy(): void {
    const msgObject = this.parseMessage(
      `UPDATE: ${this.currUser.username} left the channel`,
      'status'
    );

    const idx = this.activeUsers.findIndex((u) => u === this.currUser.username);
    if (idx != -1) this.activeUsers.splice(idx, 1);

    this.socket.emit('leave-room', msgObject);
    this.socket.disconnect();
  }

  leaveChannel() {
    this.router.navigateByUrl('/groups');
  }

  //parse message object
  parseMessage(content, type) {
    const time = new Date();
    const hours = time.getHours();
    let minutes = `${time.getMinutes()}`;
    if (minutes.length < 2) minutes = `0${minutes}`;

    const msgObject = {
      content,
      time: `${hours}:${minutes}`,
      from: this.currUser.id,
      username: this.currUser.username,
      room: this.roomName,
      avatar: this.currUser.avatar,
      type,
    };

    return msgObject;
  }

  //send message when btn clicked
  sendMessage() {
    const msgObject = this.parseMessage(this.msgText, 'message');

    this.messages.push(msgObject);
    // console.log('sending', this.messages);
    this.socket.emit('message', msgObject);
    this.msgText = '';
  }
}
