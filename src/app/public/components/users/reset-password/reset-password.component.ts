import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { ResetPassword } from 'src/app/models/account/resetPassword';
import { User } from 'src/app/models/account/user';
import { UsersService } from 'src/app/services/users.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{
  resetPasswordForm:FormGroup=new FormGroup({});
  token:string|undefined;
  email:string|undefined;
  submitted:boolean=false;
  errorMessages:string[]=[]
  loading: boolean=false;

  constructor(private userService:UsersService,private sharedService:SharedService,private formBuilder:FormBuilder,private router:Router,private activatedRoute:ActivatedRoute){

  }
  ngOnInit(): void {
    this.userService.user$.pipe(take(1)).subscribe({
      next:(user:User|null)=>{
        if(user){
          this.router.navigateByUrl('/');
        }
        else{
          this.activatedRoute.queryParamMap.subscribe({
            next:(params:any)=>{
              this.token=params.get('token');
              this.email=params.get('email');
              if(this.token&&this.email){
                this.initializeForm(this.email);
              }else{
                this.router.navigateByUrl('/login');
              }
            }

          });
          
        }
      }
    })
  }


  initializeForm(email:string){
    this.resetPasswordForm=this.formBuilder.group({
      email:[{value:email,disabled:true}],
      newPassword:['',[Validators.required,Validators.minLength(6),Validators.maxLength(15)]],
      newPasswordConfirm:['',[Validators.required,Validators.minLength(6),Validators.maxLength(15)]],

    })
  }

  resetPassword(){
    this.submitted=true;
    this.errorMessages=[]

    if(this.token&&this.email){
      const model :ResetPassword={
        token:this.token,
        email:this.email as string,
        newPassword:this.resetPasswordForm.get('newPassword')?.value
      }
      this.userService.resetPassword(model).subscribe({
        next:(res:any)=>{
          this.sharedService.showNotification(true,res.value.title,res.value.message);
          this.router.navigateByUrl('/login')
        },
          error:error=>{
            if(error.error.errors){
              this.errorMessages=error.error.errors
            }
            else{
              this.errorMessages.push(error.error)
            }
            
          }
      })
  }
  }

  onSubmit() {
    if(this.resetPasswordForm.valid){
      
      this.resetPassword()
    }
    this.loading = true;  
  }

  cancel(){
    this.router.navigateByUrl('/login')
  }

}
