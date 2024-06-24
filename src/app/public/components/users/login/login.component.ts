import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CredentialResponse } from 'google-one-tap';
import { jwtDecode } from 'jwt-decode';
import { take } from 'rxjs';
import { LoginWithExternal } from 'src/app/models/account/loginWithExternal';
import { User } from 'src/app/models/account/user';
import { UsersService } from 'src/app/services/users.service';
import { SharedService } from 'src/app/shared/shared.service';
declare const FB:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  @ViewChild('googleButton',{static:true}) 
  googleButton:ElementRef=new ElementRef({});
  loginForm:FormGroup=new FormGroup({});
  submitted:boolean=false;
  errorMessages:string[]=[]
  loading: boolean=false;;
  constructor(private usersService:UsersService,
    private router:Router,
    private formBuilder: FormBuilder,
    private sharedService:SharedService,
    private renderer2:Renderer2,@Inject(DOCUMENT) private _document:Document){
    this.usersService.user$.pipe(take(1)).subscribe({
      next:(user:User|null)=>{
        if(user){
          this.router.navigateByUrl('/')
        }

      }
    })
  }
  ngOnInit():void{
    this.initializeForm();
    this.initializeGoogleButton();
  }
  ngAfterViewInit(){
    const script1=this.renderer2.createElement('script');
    script1.src='https://accounts.google.com/gsi/client';
    script1.async='true';
    script1.defer='true';
    this.renderer2.appendChild(this._document.body,script1);
    
  }
  
  initializeForm():void{
    this.loginForm=this.formBuilder.group({
      userName:new FormControl('',[Validators.required]),
      password:new FormControl('',[Validators.required,])
    })
  }
  loginUser(loginData:any){
    this.submitted=true;
    this.errorMessages=[]
    // this.usersService
    //   .createUser(User).pipe(first() ,tap(()=>this.router.navigate(['/login'])))
    //   //.subscribe((Users:TblUser[])=>this.userUpdated.emit(Users))
    //   .subscribe({
    //     next:(user)=>{
    //       console.log(user);  
    //     }
    //   })
    this.usersService.login(loginData).subscribe({
      next:_=>{
        // if(this.returnUrl){
        //   this.router.navigateByUrl(this.returnUrl)
        // }
        // else
        this.router.navigateByUrl('/')
        
        
        // this.sharedService.showNotification(true,res.value.title,res.value.message);
        // this.router.navigateByUrl('/login')
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

  onSubmit() {
    if(this.loginForm.valid){
      this.loginUser(this.loginForm.value)
    }
    this.loading = true;  
  }

  loginWithFacebook(){
    FB.login(async(fbResult:any)=>{
      
      if(fbResult.authResponse){
        const userId=fbResult.authResponse.userID;
        const accessToken=fbResult.authResponse.accessToken;
        //this.router.navigateByUrl(`/register/thirdParty/facebook?access_token=${accessToken}&userId=${userId}`)
        this.usersService.loginWithThirdParty(new LoginWithExternal(accessToken,userId,"facebook")).subscribe({
          next:_=>{
 // if(this.returnUrl){
        //   this.router.navigateByUrl(this.returnUrl)
        // }
        // else
        this.router.navigateByUrl('/')
          },
          error:error=>{
            this.sharedService.showNotification(false,"Failed",error.error);
            // if(error.error.errors){
            //   this.errorMessages=error.error.errors;
            // }
            // else{
            //   this.errorMessages.push(error.error)
            // }
          }
        })
        
      }
      else{
        this.sharedService.showNotification(false,"Failed","Unable to login with ypur facebook")
      }
      
    })
  }

  resendEmailConfirmationLink(){
    this.router.navigateByUrl('users/sendEmail/resendemailconfirmationlink');
  }

  initializeGoogleButton() {
    
    (window as any).onGoogleLibraryLoad =(x:any)=>{ 
      // @ts-ignore
      google.accounts.id.initialize({
        client_id:'903332559756-m2g1umap0snv9d9e6lbfmpaa518ro4bi.apps.googleusercontent.com',
        callback:this.googleCallBack.bind(this),
        auto_select:false,
        cancel_on_tap_outside:true
      });
      // @ts-ignore
      google.accounts.id.renderButton(
        this.googleButton.nativeElement,
        {size:'medium',shape:'rectangular',text:'signin_with',logo_alignment:'center'}
      )

    }
  }

  private async googleCallBack(response:CredentialResponse){
    const decodeToken:any=jwtDecode(response.credential);
    this.usersService.loginWithThirdParty(new LoginWithExternal(response.credential,decodeToken.sub,"google"))
    .subscribe({
      next:_=>{
        //if(this.returnUrl){//need fix to return to last page the customer was
          //   this.router.navigateByUrl(this.returnUrl)
          // }
          // else
          this.router.navigateByUrl('/')
      },
      error:error=>{
        this.sharedService.showNotification(false,"Failed",error.error);
      }

    })
    //this.router.navigateByUrl(`/register/thirdParty/google?access_token=${response.credential}&userId=${decodeToken.sub}`)


    
  }


}
