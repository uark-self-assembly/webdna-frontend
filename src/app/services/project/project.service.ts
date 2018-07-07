import { Injectable } from '@angular/core';
import { Project, ProjectFileType, LogResponse } from './project';
import { RequestService, FileResponse } from '../request/request.service';
import { StorageService } from '../storage/storage.service';
import { Response } from '@angular/http';

@Injectable()
export class ProjectService {
  private projectsUrl = ['projects'];
  private settingsUrl(projectId: string) {
    return this.projectsUrl.concat(projectId, 'settings');
  }
  private simulationUrl(projectId: string) {
    return this.projectsUrl.concat(projectId, 'simulation');
  }
  private filesUrl(projectId: string) {
    return this.projectsUrl.concat(projectId, 'files');
  }

  constructor(private requestService: RequestService, private storageService: StorageService) { }

  getProjects(): Promise<Project[] | string> {
    return this.requestService.get(this.projectsUrl);
  }

  getProjectById(projectId: string): Promise<Project | string> {
    return this.requestService.get(this.projectsUrl.concat(projectId));
  }

  createProject(project: Project): Promise<Project | string> {
    project.user = this.storageService.user.id;
    return this.requestService.post(this.projectsUrl, project, true);
  }

  updateProject(project: Project): Promise<Project | string> {
    return this.requestService.put(this.projectsUrl.concat(project.id), project, true);
  }

  deleteProject(project: Project): Promise<Project | string> {
    return this.requestService.delete(this.projectsUrl.concat(project.id), true);
  }

  getCurrentOutput(projectId: string): Promise<LogResponse | string> {
    return this.requestService.get(this.projectsUrl.concat(projectId, 'current-output'), true);
  }

  getSettings(projectId: string): Promise<object | string> {
    return this.requestService.get(this.settingsUrl(projectId), true);
  }

  putSettings(projectId: string, settings: any): Promise<string> {
    return this.requestService.put(this.settingsUrl(projectId), settings, true);
  }

  generateVisualization(projectId: string): Promise<string> {
    return this.requestService.get(this.projectsUrl.concat(projectId, 'generate-visualization'), true);
  }

  runSimulation(projectId: string, regenerate: boolean = false): Promise<string> {
    const url = this.simulationUrl(projectId).concat('execute', '?regenerate=' + regenerate);
    return this.requestService.get(url, true);
  }

  stopSimulation(projectId: string): Promise<string> {
    return this.requestService.get(this.simulationUrl(projectId).concat('terminate'), true);
  }

  uploadFile(projectId: string, file: File, projectFileType: ProjectFileType): Promise<Response> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('type', projectFileType.toString());

    return this.requestService.putFile(this.filesUrl(projectId).concat('upload'), formData, true);
  }

  downloadZipFile(project: Project): Promise<FileResponse> {
    return this.requestService.getFile(this.filesUrl(project.id).concat('zip'), project.name + '.zip', true);
  }
}
