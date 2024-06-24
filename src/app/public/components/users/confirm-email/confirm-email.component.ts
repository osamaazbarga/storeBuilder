import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { ConfirmEmail } from 'src/app/models/account/confirmEmail';
import { User } from 'src/app/models/account/user';
import { UsersService } from 'src/app/services/users.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit{
  success: boolean=true;
  constructor(private userService:UsersService,private sharedService:SharedService,private router:Router,private activatedRoute:ActivatedRoute){}
  ngOnInit(): void {
    this.userService.user$.pipe(take(1)).subscribe({
      next:(user:User|null)=>{
        if(user){
          this.router.navigateByUrl('/')
        }else{
          this.activatedRoute.queryParamMap.subscribe({
            next:(params:any)=>{
              const confirmEmail:ConfirmEmail={
                token:params.get('token'),
                email:params.get('email')
              }

              this.userService.confirmEmail(confirmEmail).subscribe({
                next:(res:any)=>{
                  this.sharedService.showNotification(true,res.value.title,res.value.message);
                },
                error:err=>{
                  this.success=false;
                  this.sharedService.showNotification(false,"falild",err.error);
                }
              })
            }
          })
        }
      }
    })
  }

  resendEmailConfirmationLink(){
    this.router.navigateByUrl('users/sendEmail/resendemailconfirmationlink');

  }

}
