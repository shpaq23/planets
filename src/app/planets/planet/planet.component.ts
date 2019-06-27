import {Component, OnInit} from '@angular/core';
import {Planet} from '../interfaces/planet';
import {ResidentService} from '../../api/services/resident.service';
import {FilmService} from '../../api/services/film.service';
import {Resident} from '../interfaces/resident';
import {Film} from '../interfaces/film';
import {PlanetsService} from '../../api/services/planets.service';
import {ActivatedRoute, Router} from '@angular/router';
import {forkJoin, Observable} from 'rxjs';

@Component({
  selector: 'app-planet',
  templateUrl: './planet.component.html',
  styleUrls: ['./planet.component.css']
})
export class PlanetComponent implements OnInit {

  private planet: Planet;
  private id;
  private filmsLoading = true;
  private residentsLoading = true;

  constructor(private residentService: ResidentService,
              private filmService: FilmService,
              private planetsService: PlanetsService,
              private activateRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.activateRoute.paramMap.subscribe(value => {this.id = value.get('id'); });
    this.activateRoute.data.subscribe(value => {
      this.populatePlanets(value.planets);
      this.planet = this.planetsService.currentPlanets.value[this.id - 2];
    });
    const filmsRequests: Observable<Film>[] = [];
    const residentsRequests: Observable<Resident>[] = [];
    console.log(this.planet);
    this.planet.films.forEach(film => {
      filmsRequests.push(this.filmService.getFilm(film));
    });
    this.planet.residents.forEach(resident => {
      residentsRequests.push(this.residentService.getResident(resident));
    });
    forkJoin(filmsRequests)
      .subscribe(value => { this.planet.films = value; this.filmsLoading = false; this.updatePlanets(); });
    forkJoin(residentsRequests)
      .subscribe(value => {this.planet.residents = value; this.residentsLoading = false; this.updatePlanets(); });


  }

  populatePlanets(planets: Planet[]) {
    const arr: Planet[] = this.planetsService.currentPlanets.value;
    planets.forEach(value => {
      arr[value.id - 2] = value;
    });
    this.planetsService.currentPlanets.next(arr);
  }
  updatePlanets() {
    const arr = this.planetsService.currentPlanets.value;
    arr[this.planet.id - 2] = this.planet;
    this.planetsService.currentPlanets.next(arr);
  }
  backToList() {
    this.router.navigate(['/planets']);
  }

}
