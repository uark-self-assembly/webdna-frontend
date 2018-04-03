import { RequestBuilder } from "../request-builder/request.builder";
import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { AuthenticationService } from "../auth-guard/auth.service";

@Injectable()
export class ApiService {

    private apiUrl = 'api/';
    private headers = new Headers({ 'Content-Type': 'application/json' });
    requestBuilder: RequestBuilder;
    endpoint: string;

    constructor(private http: Http, private authService: AuthenticationService) {
        this.requestBuilder = new RequestBuilder(this.authService);
        this.requestBuilder.getAuthToken();
        this.endpoint = this.requestBuilder.prepEndpoint(this.apiUrl);
    }

    uploadFile(projectId: string, file: File, name: string): Promise<Response> {
        let formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('type', name);
        formData.append('id', projectId);

        let headers = new Headers();
        headers.append('Content-Type', 'multipart/form-data');

        return this.http.put(this.endpoint + 'file/upload/', formData, {headers: headers})
            .toPromise()
            .then(response => response);
    }

    getOutput(projectId: string): Promise<any> {
        var body = {
            project_id: projectId
        }
        
        return this.http.post(this.endpoint + 'checkstatus/', body, {headers: this.headers})
            .toPromise()
            .then(response => response.json());
    }

    execute(projectId: string): Promise<Response> {
        let body = {
            project_id: projectId
        }

        return this.http.post(this.endpoint + 'execute/', body, {headers: this.headers})
            .toPromise()
            .then(response => response);
    }

    setProjectSettings(projectId: string, settings: any): Promise<Response> {
        settings['project_id'] = projectId;

        console.log(settings);

        return this.http.post(this.endpoint + 'applysettings/', settings, {headers: this.headers})
            .toPromise();
    }

    runSimulation(projectId: string): Promise<Response> {
        let body = {
            project_id: projectId
        }

        return this.http.post(this.endpoint + 'execute/', body, {headers: this.headers})
            .toPromise()
    }
}
