import { RequestService } from '../request/request.service';
import { Script } from './script';
import { Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ScriptService {
  private scriptsUrl = ['scripts'];

  constructor(private requestService: RequestService, private storageService: StorageService) {

  }

  getScripts(): Promise<Script[]> {
    return this.requestService.get(this.scriptsUrl, true);
  }

  uploadScript(file: File, script: Script): Promise<Response> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('file_name', script.file_name);
    formData.append('user', this.storageService.user.id);
    formData.append('description', script.description);

    return this.requestService.putFile(this.scriptsUrl.concat('upload'), formData, true);
  }

  getPipeline(projectId: string): Promise<string> {
    return this.requestService.get(this.scriptsUrl.concat('getscriptchain', '?project_id=' + projectId), true).then(value => {
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
      script_list: scripts.map(s => s.file_name).join(',')
    };

    return this.requestService.post(this.scriptsUrl.concat('setscriptchain'), body, true);
  }

  getAnalysisLog(projectId: string): Promise<string[]> {
    return this.requestService.get(this.scriptsUrl.concat('userlog', '?project_id=' + projectId), true)
  }

  runAnalysis(projectId: string): Promise<string> {
    const body = {
      project_id: projectId
    }
    return this.requestService.post(this.scriptsUrl.concat('runanalysis'), body, true);
  }

  deleteScript(scriptId: string): Promise<string> {
    return this.requestService.delete(this.scriptsUrl.concat('delete', '?script_id=' + scriptId), true);
  }
}
