import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Planet} from '../../planets/interfaces/planet';
import {PlanetsService} from '../services/planets.service';

@Injectable({providedIn: 'root'})
export class PlanetResolverService implements Resolve<Planet[]> {
  constructor(private planetsService: PlanetsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Planet[]> | Planet[] {
    if (this.planetsService.currentPlanets && this.planetsService.currentPlanets.value[route.params.id - 1]) {
      return this.planetsService.currentPlanets.value;
    } else {
      return this.planetsService.getPlanets(Math.ceil(route.params.id / 10));
    }
  }
}
