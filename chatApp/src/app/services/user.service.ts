import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '../models/user.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  URL = `http://localhost:3000`;
  private loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  validateLogin = (username: string, password: string) =>
    this.http.post<UserInterface>(this.URL + '/login', {
      username,
      password,
    });

  setUser(user: object) {
    this.loggedIn.next(true);
    console.log(this.loggedIn);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    if (this.loggedIn) return JSON.parse(localStorage.getItem('user'));
    else return false;
  }

  logout() {
    localStorage.clear();
    this.loggedIn.next(false);
    console.log(this.loggedIn);
  }
}
