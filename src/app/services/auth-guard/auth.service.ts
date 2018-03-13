/*************************************************
AuthenticationService

Validates user information on login and keeps a
user logged in while they still have their JWT
*************************************************/

import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthenticationResponse } from './auth.response';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { tokenNotExpired } from 'angular2-jwt';
import { Request, RequestBuilder } from '../request-builder/request.builder';
import { User } from "../user/user";

@Injectable()
export class AuthenticationService {
  authToken: any;
  user: User;
  isDev: boolean;
  private authenticateURL = 'api/';
  private headers = new Headers({'Content-Type': 'application/json'});
  endpoint: string;
  request: RequestBuilder;

  constructor(private http: Http) {
    this.isDev = false; // Change to false before deployment
    this.request = new RequestBuilder(this);
    this.request.getAuthToken();
    this.endpoint = this.request.prepEndpoint(this.authenticateURL);
  }

  /********************************************************
  **  authenticateUser(user:User)
  **
  **  Sends username and password to API to authenticate
  ********************************************************/
  authenticateUser(user): Promise<AuthenticationResponse> {
    let headers = new Headers();
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    let ep = this.endpoint + 'login/';
    var request = {
      'username': user.username,
      'password': user.password
    }

    return this.http.post(ep, request)
        .toPromise()
        .then(response => response.json() as AuthenticationResponse);
  }

  loggedIn() {
    return tokenNotExpired('id_token');
  }

  /********************************************************
  **  storeUserData(token: string, user:User)
  **
  **  Stores user data on local machine so they can stay
  **  logged in on their computer
  ********************************************************/
  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  /********************************************************
  **  loadToken()
  **
  **  Gets Json Web Token from local storage
  ********************************************************/
  loadToken() : string{
     return localStorage.getItem('id_token');
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
