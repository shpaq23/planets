import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Md5} from 'ts-md5/dist/md5';
import {AuthService} from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private password = 'Alamakota1';
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.authService.tokenValue;
    if (token === Md5.hashStr(Md5.hashStr(this.password).toString())) {
      return true;
    } else {
      this.router.navigate(['/auth'], {queryParams: {returnUrl: state.url}});
      return false;
    }
  }
}
