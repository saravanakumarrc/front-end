import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reading } from './reading';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  rootURL = '/api';

  getReadings(): Observable<Reading[]> {
    return this.http.get<Reading[]>(this.rootURL + '/readings');
  }
}