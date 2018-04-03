import {Headers} from '@angular/http';
import {AuthenticationService} from '../auth-guard/auth.service';

export class Request {
  headers: Headers;
}

export class RequestBuilder {

  isDev: boolean;
  request: Request;
  authToken: string;

  constructor(private authService: AuthenticationService) {
    this.request = new Request();
    this.request.headers = new Headers();
    this.request.headers.append('Content-Type', 'application/json');
  }

  setHeaderContent(content: string) {
    this.request.headers.append('Content-Type', content);
  }

  getAuthToken() {
    this.authToken = this.authService.loadToken();
    // this.request.headers.append('Authorization', "Bearer " + this.authToken);
  }

  getUserId(): string {
    return this.authService.user.id;
  }

  prepEndpoint(endpoint) {
    if (!this.isDev) {
      return 'http://localhost:8000/' + endpoint;
    } else {
      return 'http://localhost:8000/' + endpoint;
    }
  }
}
