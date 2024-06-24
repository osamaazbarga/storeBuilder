import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { TblUser } from 'src/app/models/TblUser';
import { SuperEcommere } from 'src/app/models/super-ecommere';
import { CustomValidators } from 'src/app/shared/_helpers/custom-validators';
import { UsersService } from 'src/app/services/users.service';

import { SharedService } from 'src/app/shared/shared.service';
import { CredentialResponse } from 'google-one-tap';
import { jwtDecode } from 'jwt-decode';
import { DOCUMENT } from '@angular/common';


declare const FB:any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @ViewChild('googleButton',{static:true}) 
  googleButton:ElementRef=new ElementRef({});
  title = 'SuperEcommere';
  submitted:boolean=false;
  errorMessages:string[]=[]
  registerForm:FormGroup=new FormGroup({});
  form:FormGroup=new FormGroup({
    email:new FormControl('',[Validators.required,Validators.email]),
    //username:new FormControl(null,[Validators.required,Validators.email]),
    password:new FormControl('',[Validators.required]),
    passwordConfirm:new FormControl('',[Validators.required])
  },
  {
    validators:CustomValidators.passwordMatching
  }
  )

  get email():FormControl{
    return this.form.get('email') as FormControl
  }
  get password():FormControl{
    return this.form.get('password') as FormControl
  }
  get passwordConfirm():FormControl{
    return this.form.get('passwordConfirm') as FormControl
  }
  addUserRequest:TblUser={
    id:'',
    lastName:'',
    firstName:'',
    merchant:'',
    email:'',
    phone:'',
    password:'',
    username:''
  }
  heroes:SuperEcommere[]=[]
  ecommToEdit?:SuperEcommere
  @Input() ecomm?:SuperEcommere


  //form!: FormGroup;
    loading = false;



  // @Output() userUpdated= new EventEmitter<TblUser[]>()
  constructor(private usersService:UsersService,
    private router:Router,
    private formBuilder: FormBuilder,
    private sharedService:SharedService,
    private renderer2:Renderer2,@Inject(DOCUMENT) private _document:Document){
  }
  ngOnInit():void{
    this.initializeGoogleButton();
    this.initializeForm()
  //   this.form = this.formBuilder.group({
  //     userName: ['', Validators.required],
  //     email: ['', Validators.required],
  //     //isDeleted: ['', Validators.required],
  //     password: ['', [Validators.required, Validators.minLength(6)]]
  // });

    // this.superEcommereServies.getSuperEcommeres().subscribe((result:SuperEcommere[])=>{
    //   this.heroes=result
    // });
  }

  ngAfterViewInit(){
    const script1=this.renderer2.createElement('script');
    script1.src='https://accounts.google.com/gsi/client';
    script1.async='true';
    script1.defer='true';
    this.renderer2.appendChild(this._document.body,script1);

  }
  
  get f() { return this.form.controls; }

  initializeForm():void{
    this.registerForm=this.formBuilder.group({
      email:new FormControl('',[Validators.required,Validators.pattern('^([0-9a-zA-Z]+[-._+&amp;])*[0-9a-zA-Z]+@([-0-9a-zA-Z]+[.])+[a-zA-Z]{2,6}$')]),
      firstname:new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(15)]),
      lastname:new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(15)]),
      merchant:new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(60)]),
      phone:new FormControl('',[Validators.required,Validators.pattern(/^\+?\d{10,15}$/)]),
      password:new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(15)]),
      passwordConfirm:new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(15)])
    })
  }

  createUser(registerData:any){
    this.submitted=true;
    this.errorMessages=[]

    this.usersService.register(registerData).subscribe({
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

  onSubmit() {


    if(this.registerForm.valid){
      this.createUser(this.registerForm.value)
    }


   
   
    this.loading = true;

    
  }

  registerWithFacebook(){
    FB.login(async(fbResult:any)=>{
      
      if(fbResult.authResponse){
        const userId=fbResult.authResponse.userID;
        const accessToken=fbResult.authResponse.accessToken;
        console.log(fbResult);
        
        this.router.navigateByUrl(`/register/thirdParty/facebook?access_token=${accessToken}&userId=${userId}`)
        
      }
      else{
        this.sharedService.showNotification(false,"Failed","Unable to register with ypur facebook")
      }
      
    })
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
        {size:'medium',shape:'rectangular',text:'signup_with',logo_alignment:'center'}
      )

    }
  }

  private async googleCallBack(response:CredentialResponse){
    const decodeToken:any=jwtDecode(response.credential);
    this.router.navigateByUrl(`/register/thirdParty/google?access_token=${response.credential}&userId=${decodeToken.sub}`)


    
  }

  ngOnDestroy():void{
    //this.
  }
}
