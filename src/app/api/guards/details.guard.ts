import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DetailsGuard implements CanActivateChild  {

  private availablePlanets = [...Array(61).keys()].map(x => x + 1);
  constructor(private router: Router) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.availablePlanets.includes(parseInt(route.params.id, 10))) {
      return true;
    } else {
      this.router.navigate(['/planets']);
      return false;
    }
  }

}
