import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersService } from '../../services/users.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private usersService: UsersService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.usersService.getJWT();
    
    if (token) {
      const cloned = req.clone({
        setHeaders: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      return next.handle(cloned);
    }
    
    return next.handle(req);
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
};
