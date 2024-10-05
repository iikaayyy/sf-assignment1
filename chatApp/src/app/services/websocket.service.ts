import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  socket: Socket;
  private activeUsersSubject = new BehaviorSubject<string[]>([]);
  private messagesSubject = new BehaviorSubject<any[]>([]);

  activeUsers$ = this.activeUsersSubject.asObservable();
  messages$ = this.messagesSubject.asObservable();

  activeUsers = [];
  messages = [];

  constructor() {}

  connect() {
    this.socket = io('http://localhost:3000'); //initialize socket
  }

  setupListeners(user, room) {
    this.socket.on('connect', () => {
      const msgObject = this.parseMessage(
        `UPDATE: ${user.username} joined the channel`,
        'status',
        user,
        room
      );

      this.socket.emit('join-room', msgObject);
      // this.activeUsers.push(user.username);
      this.addActiveUser(user.username);
    });

    this.socket.on('receive-msg', (m) => {
      // if (!this.activeUsers.includes(m.username)) {
      //   this.activeUsers.push(m.username);
      // }

      // if (m.type === 'status' && m.content.split(' ').includes('left')) {
      //   const idx = this.activeUsers.findIndex((u) => u === m.username);
      //   idx != -1 ? this.activeUsers.splice(idx, 1) : 'not found';
      // }

      // this.messages.push(m);

      this.addActiveUser(m.username);
      this.messagesSubject.next([...this.messagesSubject.getValue(), m]);
    });
  }

  sendMessage(content, user, room) {
    const msgObject = this.parseMessage(content, 'message', user, room);

    // this.messages.push(msgObject);
    this.messagesSubject.next([...this.messagesSubject.getValue(), msgObject]);
    this.socket.emit('message', msgObject);
  }

  sendImage(img, user, room) {
    // console.log('called');
    const msgObject = this.parseMessage(img, 'image', user, room);

    this.messagesSubject.next([...this.messagesSubject.getValue(), msgObject]);
    this.socket.emit('imageMessage', msgObject);
  }

  disconnect(user, room) {
    const msgObject = this.parseMessage(
      `UPDATE: ${user.username} left the channel`,
      'status',
      user,
      room
    );

    // const idx = this.activeUsers.findIndex((u) => u === user.username);
    // if (idx != -1) this.activeUsers.splice(idx, 1);
    this.removeActiveUser(user.username);

    this.socket.emit('leave-room', msgObject);
    this.socket.disconnect();
  }

  private addActiveUser(username: string) {
    const activeUsers = this.activeUsersSubject.getValue();
    if (!activeUsers.includes(username)) {
      activeUsers.push(username);
      this.activeUsersSubject.next(activeUsers);
    }
  }

  private removeActiveUser(username: string) {
    const activeUsers = this.activeUsersSubject.getValue();
    const index = activeUsers.indexOf(username);
    if (index !== -1) {
      activeUsers.splice(index, 1);
      this.activeUsersSubject.next(activeUsers);
    }
  }

  private parseMessage(content, type, user, room) {
    const time = new Date();
    let hours = `${time.getHours()}`;
    let minutes = `${time.getMinutes()}`;
    if (minutes.length < 2) minutes = `0${minutes}`;

    if (hours.length < 2) hours = `0${hours}`;

    const msgObject = {
      content,
      time: `${hours}:${minutes}`,
      from: user.id,
      username: user.username,
      room,
      avatar: user.avatar,
      type,
    };

    return msgObject;
  }
}
