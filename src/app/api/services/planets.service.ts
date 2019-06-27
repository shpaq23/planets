import { Injectable } from '@angular/core';
import {environment} from '../../../../api/url.constants';
import {BehaviorSubject, Observable} from 'rxjs';
import {Planet} from '../../planets/interfaces/planet';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {PlanetsResponse} from './interfaces/planets-response';

@Injectable({
  providedIn: 'root'
})
export class PlanetsService {

  private url = environment.apiUrl + 'planets/';
  private planets: BehaviorSubject<Planet[]>;

  constructor(private http: HttpClient) { }


  set currentPlanets(planets: BehaviorSubject<Planet[]>) {
    this.planets = planets;
  }
  get currentPlanets(): BehaviorSubject<Planet[]> {
    return this.planets;
  }
  addPlanets(planets: Planet[]) {

  }
  addPlanet(planet: Planet) {
    const currentPlanets = this.planets.value;
  }
  getPlanets(page: number): Observable<Planet[]> {
    return this.http.get<PlanetsResponse>(this.url +  '?page=' + page + '&format=json')
      .pipe(
        map(data => {
            const results = data.results;
            results.forEach((value, index, array) => {
              const id = parseInt(array[index].url.replace(/^\D+/g, ''), 10);
              array[index].id = id - 1; // planets starts from 2

              // for uses of application and my structure
              if (id === 1) {array[index].id = 60; }
              if (id === 61) {array[index].id = 61; }
              delete array[index].url;
            });
            return results;
        }),
      );
  }

}
