import { Injectable } from '@angular/core';
import { Project } from './project';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AuthenticationService } from '../auth-guard/auth.service';
import { Request, RequestBuilder } from '../request-builder/request.builder';

@Injectable()
export class ProjectService {

  isDev: boolean;
  private projectsUrl = 'api/projects/';
  private headers = new Headers({'Content-Type': 'application/json'});
  request: RequestBuilder;
  endpoint: string;

  constructor(
    private http: Http,
    private authService: AuthenticationService
  ) {
    this.request = new RequestBuilder(this.authService);
    this.request.getAuthToken();
    this.endpoint = this.request.prepEndpoint(this.projectsUrl);
  }

  getProjects(): Promise<Project[]> {
    return this.http.get(this.endpoint, { headers: this.request.request.headers })
        .toPromise()
        .then(response => response.json() as Project[]);
  }

  executeProject(project: Project): Promise<number> {
    return this.http.get(this.endpoint, {headers: this.request.request.headers })
        .toPromise()
        .then(response => response.status)
  }
}
