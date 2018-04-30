import { Headers, Http, Response, RequestOptionsArgs } from '@angular/http';
import { StorageService } from '../storage/storage.service';
import { Injectable } from '@angular/core';


@Injectable()
export class RequestService {
  isDev = true;

  get baseUrl(): string {
    if (this.isDev) {
      return 'http://localhost:8000/api';
    } else {
      // TODO Need to change to production URL
      return 'http://localhost:8000/api';
    }
  }

  constructor(
    private http: Http,
    private storageService: StorageService) { }

  buildUrl(urlPieces: string[]): string {
    return this.baseUrl + '/' + urlPieces.join('/') + '/';
  }

  buildHeaders(authenticated: boolean = false): Headers {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    if (authenticated) {
      const authenticationToken = this.storageService.token;
      headers.append('Authorization', 'Bearer ' + authenticationToken);
    }

    return headers;
  }

  buildOptions(authenticated: boolean = false): RequestOptionsArgs {
    return { headers: this.buildHeaders(authenticated) };
  }

  doPromiseResult = <T>(response) => {
    const json = response.json();
    if (json.message !== 'success') {
      return json.message;
    } else {
      return json.response == null ? 'success' : json.response as T;
    }
  }

  get<T>(urlPieces: string[], authenticated: boolean = false): Promise<T | string> {
    return this.http.get(this.buildUrl(urlPieces), this.buildOptions(authenticated))
      .toPromise()
      .then(this.doPromiseResult);
  }

  post<T>(urlPieces: string[], body?: any, authenticated: boolean = false): Promise<T | string> {
    return this.http.post(this.buildUrl(urlPieces), body, this.buildOptions(authenticated))
      .toPromise()
      .then(this.doPromiseResult);
  }

  put<T>(urlPieces: string[], body?: any, authenticated: boolean = false): Promise<T | string> {
    return this.http.put(this.buildUrl(urlPieces), body, this.buildOptions(authenticated))
      .toPromise()
      .then(this.doPromiseResult);
  }

  putFile(urlPieces: string[], formData: FormData, authenticated: boolean = false): Promise<Response> {
    const headers = this.buildHeaders(authenticated);

    return this.http.put(this.buildUrl(urlPieces), formData).toPromise();
  }

  delete<T>(urlPieces: string[], authenticated: boolean = false): Promise<T | string> {
    return this.http.delete(this.buildUrl(urlPieces), this.buildOptions(authenticated))
      .toPromise()
      .then(this.doPromiseResult);
  }
}
