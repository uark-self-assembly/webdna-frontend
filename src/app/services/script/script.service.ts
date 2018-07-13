import { RequestService } from '../request/request.service';
import { Script } from './script';
import { Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ScriptService {
  private usersUrl = ['users'];

  get userId(): string {
    return this.storageService.user.id;
  }

  get scriptsUrl() {
    return this.usersUrl.concat(this.userId).concat('scripts');
  }

  projectsUrl(projectId) {
    return ['projects'].concat(projectId);
  }

  constructor(private requestService: RequestService, private storageService: StorageService) { }

  getScripts(): Promise<Script[]> {
    return this.requestService.get(this.scriptsUrl, true);
  }

  uploadScript(file: File, script: Script): Promise<Response> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('file_name', script.file_name);
    formData.append('description', script.description);

    return this.requestService.putFile(this.scriptsUrl.concat('upload'), formData, true);
  }

  getScriptChain(projectId: string): Promise<string> {
    return this.requestService.get(this.projectsUrl(projectId).concat('scriptchain'), true).then(value => {
      console.log(value);
      if (Array.isArray(value) && value.length > 0) {
        return value[0];
      } else {
        return value;
      }
    });
  }

  setPipeline(projectId: string, scripts: Script[]): Promise<string> {
    const body = {
      project_id: projectId,
      script_list: scripts.map(s => s.id).join(',')
    };

    return this.requestService.post(this.projectsUrl(projectId).concat('scriptchain'), body, true);
  }

  getAnalysisLog(projectId: string): Promise<string[]> {
    return this.requestService.get(this.projectsUrl(projectId).concat('userlog'), true).then((response: string[]) => {
        console.log(response);
        return response;
    });
  }

  runAnalysis(projectId: string): Promise<string> {
    return this.requestService.post(this.projectsUrl(projectId).concat('execute-analysis'), null, true);
  }

  deleteScript(scriptId: string): Promise<string> {
    return this.requestService.delete(this.scriptsUrl.concat(scriptId), true);
  }
}
