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
  private headers = new Headers({ 'Content-Type': 'application/json' });
  requestBuilder: RequestBuilder;
  endpoint: string;

  constructor(
    private http: Http,
    private authService: AuthenticationService
  ) {
    this.requestBuilder = new RequestBuilder(this.authService);
    this.requestBuilder.getAuthToken();
    this.endpoint = this.requestBuilder.prepEndpoint(this.projectsUrl);
  }

  getProjects(): Promise<Project[]> {
    return this.http.get(this.endpoint, { headers: this.requestBuilder.request.headers })
      .toPromise()
      .then(response => response.json() as Project[]);
  }

  createProject(project: Project): Promise<Project> {
    project.user = this.requestBuilder.getUserId();
    return this.http.post(this.endpoint, project, { headers: this.requestBuilder.request.headers })
      .toPromise()
      .then(response => response.json() as Project);
  }

  updateProject(project: Project): Promise<Project> {
    return this.http.put(this.endpoint + project.id + '/', project, { headers: this.requestBuilder.request.headers })
      .toPromise()
      .then(response => response.json() as Project);
  }

  deleteProject(project: Project): Promise<boolean> {
    return this.http.delete(this.endpoint + project.id + '/', { headers: this.requestBuilder.request.headers })
      .toPromise()
      .then(response => response.status == 204);
  }
}
