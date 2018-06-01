import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { RequestService } from '../request/request.service';

export class LogResponse {
    running: boolean;
    log: string;
    stdout: string;
}

@Injectable()
export class ApiService {

    private apiUrl = [];

    constructor(private requestService: RequestService) { }

    uploadFile(projectId: string, file: File, name: string): Promise<Response> {
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('type', name);
        formData.append('id', projectId);

        return this.requestService.putFile(this.apiUrl.concat('file', 'upload'), formData, true);
    }

    checkRunning(projectId: string): Promise<LogResponse | string> {
        return this.requestService.get(this.apiUrl.concat('checkrunning', '?project_id=' + projectId), true);
    }

    getOutput(projectId: string): Promise<LogResponse | string> {
        const body = {
            project_id: projectId
        }

        return this.requestService.post(this.apiUrl.concat('checkstatus'), body, true);
    }

    getProjectSettings(projectId: string): Promise<object | string> {
        const body = {
            project_id: projectId
        }

        return this.requestService.post(this.apiUrl.concat('getsettings'), body, true);
    }

    setProjectSettings(projectId: string, settings: any): Promise<string> {
        settings['project_id'] = projectId;

        return this.requestService.post(this.apiUrl.concat('applysettings'), settings);
    }

    runSimulation(projectId: string, shouldRegenerate: boolean = false): Promise<string> {
        const body = {
            project_id: projectId,
            should_regenerate: shouldRegenerate
        };

        return this.requestService.post(this.apiUrl.concat('execute'), body);
    }

    forceVisualization(projectId: string): Promise<string> {
        return this.requestService.get(this.apiUrl.concat('trajectory', '?project_id=' + projectId), true);
    }

    terminate(projectId: string): Promise<string> {
        const body = {
            project_id: projectId
        };
        return this.requestService.post(this.apiUrl.concat('terminate'), body, true);
    }
}
