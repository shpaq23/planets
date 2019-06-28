import {Component, OnInit, ViewChild} from '@angular/core';
import {Planet} from '../interfaces/planet';
import {PlanetsService} from '../../api/services/planets.service';
import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import {MatPaginator, MatTableDataSource, PageEvent} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-planets',
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.css']
})
export class PlanetsComponent implements OnInit {


  private planets: Planet[] = new Array(61); // 61 planets from backend
  private page = 1;
  private childPage: number;
  private planetsLoaded = 0;
  private loading: boolean;
  private childActivated = false;

  // table / pagination
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  private dataSource: MatTableDataSource<Planet>;


  private columns = ['name', 'rotation_period', 'orbital_period',
    'diameter', 'climate', 'gravity', 'terrain', 'surface_water', 'population', 'actions'];

  constructor(private planetsService: PlanetsService,
              private router: Router) {}

  ngOnInit() {
    this.planetsService.currentPlanets = new BehaviorSubject<Planet[]>(this.planets);
    this.planetsService.currentPlanets.asObservable().subscribe(value => { this.planets = value; });
    if (!this.childActivated) {
      this.loading = true;
      this.planetsService.getPlanets(this.page)
        .subscribe(value => {
          this.populatePlanets(value);
          this.planetsLoaded += value.length;
          this.initTable();
          this.loading = false;
        });
    }
  }

  populatePlanets(planets: Planet[]) {
    planets.forEach(value => {
      this.planets[value.id - 1] = value;
    });
    this.planetsService.currentPlanets.next(this.planets);
  }
  initTable() {
    this.dataSource = new MatTableDataSource<Planet>(this.planets);
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data, filter: string) => {
      return data.name.toLowerCase().includes(filter); // filtering only by name as required in the task
    };
  }
  calculatePagesToLoad(pageEvent: PageEvent): number {
   const planetsLoaded = this.planetsService.currentPlanets.value.filter(Boolean).length;
   if (planetsLoaded < pageEvent.length) {
      const planetsPerRequest = 10; // 10 planets for 1 request from backend
      let planetsRequired = (pageEvent.pageIndex + 1) * pageEvent.pageSize;
      planetsRequired = planetsRequired > pageEvent.length ? pageEvent.length : planetsRequired;
      if (planetsRequired > planetsLoaded) {
        return Math.ceil((planetsRequired - planetsLoaded) / planetsPerRequest);
      }
    }
   return 0;
  }
  pagination(event?: PageEvent) {
   const pages = this.calculatePagesToLoad(event);
   if (pages === 1 && this.page + 1 === this.childPage) { return; }
   if (pages > 0) {
    this.loading = true;
    const requests: Observable<Planet[]>[] = [];
    for (let i = 0; i < pages; i++) {
      this.page++;
      if (this.page === this.childPage) { continue; }
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
  filtering(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  details(planet: Planet) {
    this.router.navigate(['/planets/' + planet.id]);
  }
  deactivateChild() {
    this.childPage = Math.ceil(this.planets.findIndex(x => x !== undefined) / 10) + 1;
    if (this.childPage - 1 !== 0) {
      this.loading = true;
      this.planetsService.getPlanets(1).subscribe(value => {
        this.populatePlanets(value);
        this.planetsLoaded += value.length + (this.childPage === 7 ? 1 : 10) ;
        this.initTable();
        this.loading = false;
        this.childActivated = false;
      });
    } else {
      this.initTable();
      this.childActivated = false;
    }
  }
}
