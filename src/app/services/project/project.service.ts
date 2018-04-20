import { Injectable } from '@angular/core';
import { Project } from './project';
import { RequestService } from '../request/request.service';

@Injectable()
export class ProjectService {
  private projectsUrl = ['projects'];

  constructor(private requestService: RequestService) { }

  getProjects(): Promise<Project[] | string> {
    return this.requestService.get(this.projectsUrl);
  }

  createProject(project: Project): Promise<Project | string> {
    return this.requestService.post(this.projectsUrl, project);
  }

  updateProject(project: Project): Promise<Project | string> {
    return this.requestService.put(this.projectsUrl.concat(project.id), project);
  }

  deleteProject(project: Project): Promise<Project | string> {
    return this.requestService.delete(this.projectsUrl.concat(project.id));
  }
}
