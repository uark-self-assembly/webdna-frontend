import { Injectable } from '@angular/core';
import { User } from './user';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AuthenticationService } from '../auth-guard/auth.service';
import { RequestService } from '../request/request.service';
import { AuthenticationResponse } from '../auth-guard/auth.response';

@Injectable()
export class UserService {
  private usersUrl = ['users'];
  private registerUrl = ['register'];

  constructor(private requestService: RequestService) { }

  // Register user method goes here
  registerUser(user: User): Promise<AuthenticationResponse | string> {
    return this.requestService.post(this.registerUrl, user);
  }

  getUsers(): Promise<User[] | string> {
    return this.requestService.get(this.usersUrl, true);
  }
}
