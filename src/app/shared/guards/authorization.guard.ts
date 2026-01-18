import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { SharedService } from '../shared.service';
import { User } from 'src/app/models/account/user';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard {
  constructor(private userService:UsersService,private sharedService:SharedService,private router:Router){
    
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = this.userService.getJWT();
    if (token) {
      return of(true);
    } else {
      this.sharedService.showNotification(false,"Authentication Required","Please login to access dashboard");
      this.router.navigate(['/login'],{queryParams:{returnUrl:state.url}})
      return of(false);
    }
  }
  
}
