import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { RegisterWithExternal } from 'src/app/models/account/registerWithExternal';
import { User } from 'src/app/models/account/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register-with-third-party',
  templateUrl: './register-with-third-party.component.html',
  styleUrls: ['./register-with-third-party.component.css']
})
export class RegisterWithThirdPartyComponent implements OnInit{
  submitted:boolean=false;
  errorMessages:string[]=[]
  registerForm:FormGroup=new FormGroup({});
  provider:string|null=null;
  access_token:string|null=null;
  userId:string|null=null;



  constructor(private usersService:UsersService,private router:Router,private formBuilder: FormBuilder,private ActivatedRoute:ActivatedRoute){

  }
  ngOnInit(): void {
    
    console.log(this.ActivatedRoute.queryParamMap);
    
    this.usersService.user$.pipe(take(1)).subscribe({     
      next:(user:User|null)=>{
        if(user){
          this.router.navigateByUrl('/');
        }
        
        else{
          this.ActivatedRoute.queryParamMap.subscribe({
            next:(params:any)=>{
              console.log(params);
              
              this.provider=this.ActivatedRoute.snapshot.paramMap.get('provider');
              this.access_token=params.get('access_token');
              this.userId=params.get('userId');
              if(this.provider&&this.access_token&&this.userId&&(this.provider==='facebook'||this.provider==='google')){
                this.initializeForm();
              }
              else{
                this.router.navigateByUrl('/register')
              }
            }
          })
          
        }
      }

    })
  }
  initializeForm(){
    this.registerForm=this.formBuilder.group({
      firstName:new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(15)]),
      lastName:new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(15)]),
    });

    
  }

  createUser(registerData:any){
    this.submitted=true;
    this.errorMessages=[]

    if(this.userId&&this.access_token&&this.provider){
      const firstName=this.registerForm.get('firstName')?.value;
      const lastName=this.registerForm.get('lastName')?.value;
      const model =new RegisterWithExternal(firstName,lastName,this.userId,this.access_token,this.provider);
      this.usersService.registerWithThirdParty(model).subscribe({
        next:_=>{
          this.router.navigateByUrl('/');
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

  onSubmit(){
    if(this.registerForm.valid){
      this.createUser(this.registerForm.value)
    }
  }

}
