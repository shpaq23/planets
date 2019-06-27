import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Resident} from '../../planets/interfaces/resident';

@Injectable({
  providedIn: 'root'
})
export class ResidentService {

  constructor(private http: HttpClient) { }

  getResident(url: string): Observable<Resident> {
    return this.http.get<Resident>(url + '?format=json');
  }
}
