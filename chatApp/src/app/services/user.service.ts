import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '../models/user.model';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private URL = `http://localhost:3000`;

  //OBSERVABLE VALUES
  private loggedIn = new BehaviorSubject<boolean>(this.getInitialLoginState());
  loggedIn$ = this.loggedIn.asObservable(); //Current login status as an observable

  private user = new BehaviorSubject<any>(this.getInitialUser());
  user$ = this.user.asObservable(); //Current User as an observable

  constructor(private http: HttpClient) {
    console.log('user service');
  }

  private getInitialLoginState() {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('user');
    }
    return false;
  }

  private getInitialUser(): any {
    //if user exists in localStorage then return user
    if (this.getInitialLoginState()) {
      const user = JSON.parse(localStorage.getItem('user'));

      return user;
    } else return null;
  }

  validateLogin = (username: string, password: string) =>
    this.http.post<UserInterface>(this.URL + '/login', {
      username,
      password,
    });

  setUser(user: object) {
    this.loggedIn.next(true);
    this.user.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  deleteUser(userId) {
    console.log(`delete user called`);
    console.log(userId);
    this.http
      .post(this.URL + '/delete-user', { id: userId })
      .subscribe((res) => {
        this.logout();
      });
  }

  logout() {
    localStorage.removeItem('user');
    this.loggedIn.next(false);
  }
}
