// import { CanActivateFn } from '@angular/router';

// export const adminGuard: CanActivateFn = (route, state) => {
//   return true;
// };

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { SharedService } from '../shared.service';
import { User } from 'src/app/models/account/user';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(private userService:UsersService,private sharedService:SharedService,private router:Router){
    
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userService.user$.pipe(
      map((user:User|null)=>{
        if(user){
          const decodeToken:any=jwtDecode(user.jwt);
          if(decodeToken.role.includes('Admin')){
            return true
          }
        }
        
        this.sharedService.showNotification(false,"admin Area","Leave now!");
        this.router.navigateByUrl('/');

        

        return false
      })
    );
  }
  
}