import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Md5} from 'ts-md5';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: BehaviorSubject<string>;

  constructor() {
    this.token = new BehaviorSubject<string>(localStorage.getItem('token'));
  }

  public get tokenValue(): string {
    return this.token.value;
  }

  login(password: string) {
    localStorage.setItem('token', Md5.hashStr(Md5.hashStr(password).toString()).toString());
    this.token.next(localStorage.getItem('token'));
  }
}
