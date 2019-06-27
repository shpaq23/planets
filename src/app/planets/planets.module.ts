import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanetsRoutingModule } from './planets-routing.module';
import { PlanetsComponent } from './planets/planets.component';
import { PlanetComponent } from './planet/planet.component';
import {
  MatButtonModule,
  MatFormFieldModule, MatInputModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule, MatTooltipModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ResidentsComponent } from './residents/residents.component';
import { FilmsComponent } from './films/films.component';

@NgModule({
  declarations: [PlanetsComponent, PlanetComponent, ResidentsComponent, FilmsComponent],
  imports: [
    CommonModule,
    PlanetsRoutingModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonModule,
  ]
})
export class PlanetsModule { }
