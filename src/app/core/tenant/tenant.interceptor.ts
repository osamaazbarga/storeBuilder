import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TenantService } from './tenant.service';

@Injectable()
export class TenantInterceptor implements HttpInterceptor {
  constructor(private tenantService: TenantService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const id = this.tenantService.id;
    if (!id) return next.handle(req);

    const cloned = req.clone({
      setHeaders: { 'X-Tenant-ID': id }
    });
    return next.handle(cloned);
  }
}

export const TenantInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TenantInterceptor,
  multi: true
};