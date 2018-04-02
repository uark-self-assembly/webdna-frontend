import { Injectable } from '@angular/core';
import { User } from './user';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AuthenticationService } from '../auth-guard/auth.service';
import { Request, RequestBuilder } from '../request-builder/request.builder';

@Injectable()
export class UserService {

  isDev: boolean;
  private usersUrl = 'api/users/';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  request: RequestBuilder;
  endpoint: string;

  constructor(
    private http: Http,
    private authService: AuthenticationService
  ) {
    this.request = new RequestBuilder(this.authService);
    this.request.getAuthToken();
    this.endpoint = this.request.prepEndpoint(this.usersUrl);
  }

  // Register user method goes here
  registerUser(user: User): Promise<User> {
    return this.http.post(this.request.prepEndpoint('api/register/'), user, { headers: this.request.request.headers })
      .toPromise()
      .then(response => {
        return response.json() as User
      });
  }

  getUsers(): Promise<User[]> {
    return this.http.get(this.endpoint, { headers: this.request.request.headers })
      .toPromise()
      .then(response => {
        return response.json() as User[]
      });
  }
}
