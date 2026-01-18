import { Injectable } from '@angular/core';
import { CanActivateFn,ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { UsersService } from '../services/users.service';
import { SharedService } from '../shared/shared.service';
import { Observable, map, of } from 'rxjs';
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
  constructor(
    private userService: UsersService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const token = this.userService.getJWT();
    
    if (token) {
      // Simply check if token exists - refreshUser will be called by app.component
      return of(true);
    } else {
      // No token found
      this.sharedService.showNotification(false, 'Authentication Required', 'Please login to continue');
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return of(false);
    }
  }
}


// export class authGuard implements CanActivateFn{
//   constructor(private router:Router){

//   }
//   CanActivate(route:ActivatedRouteSnapshot)
// }
