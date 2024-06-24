import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { User } from 'src/app/models/account/user';
import { UsersService } from 'src/app/services/users.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent implements OnInit{
  emailForm:FormGroup=new FormGroup({});
  submitted:boolean=false;
  mode:string|undefined;
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
          const mode=this.activatedRoute.snapshot.paramMap.get('mode');
          if(mode){
            this.mode=mode
            console.log(this.mode);
            
            this.initializeForm();

          }
          
        }
      }
    })
  }

  initializeForm(){
    this.emailForm=this.formBuilder.group({
      email:['',[Validators.required,Validators.pattern('^([0-9a-zA-Z]+[-._+&amp;])*[0-9a-zA-Z]+@([-0-9a-zA-Z]+[.])+[a-zA-Z]{2,6}$')]]
    })
  }

  sendEmail(Data:any){
    this.submitted=true;
    this.errorMessages=[]
    
    if(this.mode?.includes('resendemailconfirmationlink')){
        this.userService.resendEmailConfirmationLink(this.emailForm.get('email')?.value).subscribe({
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
    else if(this.mode?.includes('forgotpassword')){
      this.userService.forgetPassword(this.emailForm.get('email')?.value).subscribe({
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

    // this.userService.register(Data).subscribe({
    //   next:(res:any)=>{
    //     this.sharedService.showNotification(true,res.value.title,res.value.message);
    //     this.router.navigateByUrl('/login')
    //   },
    //   error:error=>{
    //     if(error.error.errors){
    //       this.errorMessages=error.error.errors
    //     }
    //     else{
    //       this.errorMessages.push(error.error)
    //     }
        
    //   }
    // })

  }

  onSubmit() {
    if(this.emailForm.valid&&this.mode){
      
      this.sendEmail(this.emailForm.value)
    }
    this.loading = true;  
  }

  cancel(){
    this.router.navigateByUrl('/login')
  }
}

