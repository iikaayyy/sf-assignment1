import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket, io } from 'socket.io-client';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  currUser;
  channelName;
  msgText = '';
  socket: Socket;

  constructor(private route: ActivatedRoute, public user: UserService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.channelName = params.get('channelName');
      console.log(this.channelName);
    });

    this.user.user$.subscribe((val) => {
      this.currUser = val;
      console.log(val);
    });

    // this.socket = io('http://localhost:3000');
    // this.socket.on('connect', () => console.log('connected'));
    // this.socket.on('message', (msg) => console.log(msg));
  }

  sendMessage() {
    this.socket.emit('message', this.msgText);
    this.msgText = '';
  }
}
