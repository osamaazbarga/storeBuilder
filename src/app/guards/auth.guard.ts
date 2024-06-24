import { Injectable } from '@angular/core';
import { CanActivateFn,ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { UsersService } from '../services/users.service';
import { SharedService } from '../shared/shared.service';
import { Observable, map } from 'rxjs';
import { User } from '../models/account/user';

@Injectable({
  providedIn:'root'
})

// export const authGuard: CanActivateFn = (route, state) => {
//   let router:Router=new Router()
//   router.navigate([''])
//   return false;
// };

export class AuthorizationGuard{
  constructor(private userService:UsersService,private sharedService:SharedService,private router:Router){}
  canActive(route:ActivatedRouteSnapshot,state:RouterStateSnapshot):Observable<boolean>{
    return this.userService.user$.pipe(
      map((user:User|null)=>{
        if (user){
          return true
        }
        else{
          this.sharedService.showNotification(false,'Restricted Area','Leave immediately!');
          this.router.navigate(['/login'],{queryParams:{returnUrl:state.url}})
          return false
        }
      })
    )
  }

  
}


// export class authGuard implements CanActivateFn{
//   constructor(private router:Router){

//   }
//   CanActivate(route:ActivatedRouteSnapshot)
// }
