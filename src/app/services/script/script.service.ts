import { RequestService } from 'app/services/request/request.service';
import { Script } from './script';
import { Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ScriptService {
  private scriptsUrl = ['scripts'];

  constructor(private requestService: RequestService, private storageService: StorageService) {

  }

  getScripts(): Promise<Script[] | string> {
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
}
