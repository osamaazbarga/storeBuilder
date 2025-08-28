import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
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
    return this.userService.user$.pipe(
      map((user:User|null)=>{
        if(user){
          return true
        }
        else{
          this.sharedService.showNotification(false,"restricted Area","Leave immediately!");
          this.router.navigate(['/login'],{queryParams:{returnUrl:state.url}})
          return false;
        }
      })
    );
  }
  
}
