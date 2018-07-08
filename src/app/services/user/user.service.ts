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
  private registerUrl = this.usersUrl.concat('register');

  constructor(private requestService: RequestService) { }

  registerUser(user: User): Promise<AuthenticationResponse> {
    return this.requestService.post(this.registerUrl, user);
  }
}
