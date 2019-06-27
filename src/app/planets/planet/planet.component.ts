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
      this.planet = this.planetsService.currentPlanets.value[this.id - 1];
    });
    const filmsRequests: Observable<Film>[] = [];
    const residentsRequests: Observable<Resident>[] = [];
    if (this.planet.films.length > 0 && !this.isFilm(this.planet.films[0])) {
      this.planet.films.forEach(film => {
        filmsRequests.push(this.filmService.getFilm(film));
      });
      forkJoin(filmsRequests)
        .subscribe(value => { this.planet.films = value; this.filmsLoading = false; this.updatePlanets(); });
    } else {this.filmsLoading = false; }
    if (this.planet.residents.length > 0 && !this.isResident(this.planet.residents[0])) {
      this.planet.residents.forEach(resident => {
        residentsRequests.push(this.residentService.getResident(resident));
      });
      forkJoin(residentsRequests)
        .subscribe(value => {this.planet.residents = value; this.residentsLoading = false; this.updatePlanets(); });
    } else {this.residentsLoading = false; }
  }

  populatePlanets(planets: Planet[]) {
    const arr: Planet[] = this.planetsService.currentPlanets.value;
    planets.forEach(value => {
      arr[value.id - 1] = value;
    });
    this.planetsService.currentPlanets.next(arr);
  }
  updatePlanets() {
    const arr = this.planetsService.currentPlanets.value;
    arr[this.planet.id - 1] = this.planet;
    this.planetsService.currentPlanets.next(arr);
  }
  backToList() {
    this.router.navigate(['/planets']);
  }
  isFilm(film: Film | string): film is Film {
    return (film as Film).title !== undefined;
  }
  isResident(resident: Resident | string): resident is Resident {
    return (resident as Resident).name !== undefined;
  }

}
