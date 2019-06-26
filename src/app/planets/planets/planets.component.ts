import {Component, OnInit, ViewChild} from '@angular/core';
import {Planet} from '../interfaces/planet';
import {PlanetsService} from '../../api/services/planets.service';
import {forkJoin, Observable} from 'rxjs';
import {MatPaginator, MatTableDataSource, PageEvent} from '@angular/material';

@Component({
  selector: 'app-planets',
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.css']
})
export class PlanetsComponent implements OnInit {


  private planets: Planet[] = new Array(61); // 61 planets from backend
  private page = 1;
  private planetsLoaded = 0;
  private loading = true;

  // table - pagination
  private dataSource: MatTableDataSource<Planet>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  private columns = ['name', 'rotation_period', 'orbital_period',
    'diameter', 'climate', 'gravity', 'terrain', 'surface_water', 'population'];

  constructor(private planetsService: PlanetsService) {}

  ngOnInit() {
    this.planetsService.getPlanets(this.page)
      .subscribe(value => {
        this.populatePlanets(value);
        this.planetsLoaded += value.length;
        this.initTable();
        this.loading = false;
      });
  }

  populatePlanets(planets: Planet[]) {
    planets.forEach(value => {
      this.planets[value.id - 2] = value;
    });
  }
  initTable() {
    this.dataSource = new MatTableDataSource<Planet>(this.planets);
    this.dataSource.paginator = this.paginator;
  }
  calculatePagesToLoad(pageEvent: PageEvent): number {
    const numberOfPlanets = 61; // all available planets
    if (this.planetsLoaded < numberOfPlanets) {
      const planetsPerRequest = 10; // 10 planets for 1 request from backend
      let planetsRequired = (pageEvent.pageIndex + 1) * pageEvent.pageSize;
      planetsRequired = planetsRequired > numberOfPlanets ? numberOfPlanets : planetsRequired;
      if (planetsRequired > this.planetsLoaded) {
        return Math.ceil((planetsRequired - this.planetsLoaded) / planetsPerRequest);
      }
    }
    return 0;
  }

  pagination(event?: PageEvent) {
    const pages = this.calculatePagesToLoad(event);
    if (pages > 0) {
      this.loading = true;
      const requests: Observable<Planet[]>[] = [];
      for (let i = 0; i < pages; i++) {
        this.page++;
        requests.push(this.planetsService.getPlanets(this.page));
      }
      forkJoin(requests)
        .subscribe(value => {
          value.forEach(planets => {
            this.populatePlanets(planets);
            this.planetsLoaded += planets.length;
          });
          this.initTable();
          this.loading = false;
        });
    }
  }
}
