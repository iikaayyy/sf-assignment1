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
  socket: Socket;

  constructor(
    private route: ActivatedRoute,
    public user: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.channelName = params.get('channelName');
      this.groupName = params.get('name');
      this.roomName = this.groupName + this.channelName;
      // console.log(this.roomName);
    });

    this.user.user$.subscribe((val) => {
      this.currUser = val;
      console.log(this.currUser.avatar);
    });

    this.socket = io('http://localhost:3000');

    this.socket.on('connect', () => {
      console.log('connected');
      this.socket.emit('join-room', {
        roomName: this.roomName,
        username: this.currUser.username,
      });
    });

    this.socket.on('newUser', (m) => console.log(m));
    this.socket.on('newDisconnection', (m) => console.log(m));
    this.socket.on('receive-msg', (m) => {
      this.messages.push(m);
      console.log('receiving', this.messages);
    });
  }

  ngOnDestroy(): void {
    console.log('destroying');
    this.socket.emit('newDisconnection', {
      username: this.currUser.username,
      roomName: this.roomName,
    });
    this.socket.disconnect();
  }

  leaveChannel() {
    this.router.navigateByUrl('/groups');
  }

  sendMessage() {
    const time = new Date();
    const msgTime = `${time.getHours()}:${time.getMinutes()}`;
    const msgObject = {
      content: this.msgText,
      time: msgTime,
      from: this.currUser.id,
      username: this.currUser.username,
      room: this.roomName,
      avatar: this.currUser.avatar,
    };

    // console.log(msgObject);
    this.messages.push(msgObject);
    console.log('sending', this.messages);
    this.socket.emit('message', msgObject);
    this.msgText = '';
  }
}
