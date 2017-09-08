import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';

import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class APIService {

  public status: BehaviorSubject<any> = new BehaviorSubject(
    { loading: false }
  );

  constructor(
    private authentication: AuthenticationService,
    private config: ConfigurationService,
    private http: Http,
  ) { }

  get(path): Observable<any> {
    let url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    this.status.next({ loading: true });
    return this.http.get(url, { headers: headers }).map(res => {
      this.status.next({ loading: false });
      return res.json()
    })
    .catch(this.error.bind(this));
  }

  post(path, data): Observable<any> {
    let url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    this.status.next({ loading: true });
    return this.http.post(url, data, { headers: headers }).map(res => {
      this.status.next({ loading: false });
      return res.json()
    })
    .catch(this.error.bind(this));
  }

  patch(path, data): Observable<any> {
    let url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    this.status.next(true);
    return this.http.patch(url, data, { headers: headers }).map(res => {
      this.status.next({ loading: false });
      return res.json()
    })
    .catch(this.error.bind(this));
  }

  delete(path): Observable<any> {
    let url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    this.status.next(true);
    return this.http.delete(url, { headers: headers }).map(res => {
      this.status.next({ loading: false });
      return res.json()
    })
    .catch(this.error.bind(this));
  }

  getFullPath(path: string) {
    const base = this.config.get('BACKEND_URL');
    // if path is already prefixed by base, no need to prefix twice
    // if path is already a full url, and base is a local url, no need to prefix either
    if (path.startsWith(base) || (base.startsWith('/') && path.startsWith('http'))) {
      return path;
    } else {
      return base + path;
    }
  }

  private error(err: any) {
    if (err instanceof Response) {
      err = err.json();
    }
    this.status.next({ loading: false, error: err });
    return Observable.throw(err);
  }
}