import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { take } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';

@Directive({
  selector: '[appUserHasRole]'
})
export class UserHasRoleDirective {

  constructor(private viewContainerRef:ViewContainerRef,
    private templateRef:TemplateRef<any>,
    private userService:UsersService) { }
  
    ngOnInit():void{
      this.userService.user$.pipe((take(1))).subscribe({
        next:user=>{
          if(user){
            const decodeToken:any=jwtDecode(user.jwt);
            if(/*decodeToken.role.some((role:any)=> this.appUserHasRole.includes(role))*/true){
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
            else{
              this.viewContainerRef.clear();
            }
          }
          else{
            this.viewContainerRef.clear();
          }
        }
      })
    }

}
