import { RequestService } from 'app/services/request/request.service';
import { Script } from './script';
import { Injectable } from '@angular/core';

@Injectable()
export class ScriptService {
  private scriptsUrl = ['scripts'];

  constructor(private requestService: RequestService) {

  }

  getScripts(): Promise<Script[] | string> {
    return this.requestService.get(this.scriptsUrl, true);
  }
}
