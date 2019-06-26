import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PlanetsComponent} from './planets/planets/planets.component';
import {AuthComponent} from './auth/auth.component';
import {AuthGuard} from './api/guards/auth.guard';
import {IsLoggedGuard} from './api/guards/is-logged.guard';
import {PlanetComponent} from './planets/planet/planet.component';

const routes: Routes = [
  {
    path: 'planets',
    component: PlanetsComponent,
    canActivate: [AuthGuard],
    children: [
      {path: ':id', component: PlanetComponent}
    ]
  },
  {path: 'auth', component: AuthComponent, canActivate: [IsLoggedGuard]},



  {path: '**', redirectTo: '/planets'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
