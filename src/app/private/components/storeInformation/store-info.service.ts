import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, take } from 'rxjs';
import { User } from 'src/app/models/account/user';
import { StoreAddEdit } from 'src/app/models/store/StoreAddEdit';
import { StoreDetails } from 'src/app/models/store/soreDetails';
import { UsersService } from 'src/app/services/users.service';
import { SharedService } from 'src/app/shared/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreInfoService {
  private activeStepSubject = new BehaviorSubject<number>(1);
  activeStep$ = this.activeStepSubject.asObservable();
  headers:any=new HttpHeaders();
  errorMessages:string[]=[];
  storeAddEdit:StoreAddEdit | undefined
  


  multiStepForm: FormGroup = this.fb.group({
    personalDetails: this.fb.group({
      storeName: ['', [Validators.required, Validators.minLength(4)]],
      storeLink: ['', [Validators.required]],
      // phone: ['', [Validators.required, Validators.minLength(10)]],

    }),
    planDetails: this.fb.group({
      plan: ['arcade', [Validators.required]],
      duration: ['monthly', [Validators.required]],
      planCost: [9],
      totalCost: [9]
    }),
    addOnDetails: this.fb.group({
      service: [false],
      serviceCost: [0],
      storage: [false],
      storageCost: [0],
      customization: [false],
      customizationCost: [0],
    })
  })

  get stepForm(): FormGroup {
    return this.multiStepForm;
  }

  constructor(private fb: FormBuilder,
    private http:HttpClient,
    private userServies:UsersService,
    private sharedService:SharedService,
    private router:Router) { }

  goToNextStep(number: number|undefined) {
    if(number!=null){
      this.activeStepSubject.next(number + 1);
    }
  }

  goBackToPreviousStep(number: number|undefined) {
    if(number!=null){
      this.activeStepSubject.next(number - 1);
    }
  }
  submit() {
    //TO-DO => validate form
    this.goToNextStep(4);
    console.log(this.stepForm.value.personalDetails);
    this.storeAddEdit=new StoreAddEdit()
    this.storeAddEdit!.name=this.stepForm.value.personalDetails.storeName
    this.storeAddEdit!.link=this.stepForm.value.personalDetails.storeLink
    this.storeAddEdit!.category=this.stepForm.value.personalDetails.storeLink
    this.storeAddEdit!.kind=this.stepForm.value.personalDetails.storeLink
    this.storeAddEdit!.description=this.stepForm.value.personalDetails.storeLink
    this.storeAddEdit!.logo=this.stepForm.value.personalDetails.storeLink
    this.storeAddEdit!.userId=this.stepForm.value.personalDetails.storeLink


    
    // this.storeAddEdit!.user=this.stepForm.value.personalDetails.storeLink

    this.userServies.user$.pipe(take(1)).subscribe({     
      next:(user:User|null)=>{
        if(user){ 
          this.storeAddEdit!.userId=user.id
          this.storeAddEdit!.user=user
        }
        
      }

    })

    this.errorMessages=[];
    
    if(this.storeAddEdit){

      this.addEditStore(this.storeAddEdit).subscribe({
        next:(Response:any)=>{
          console.log(this.storeAddEdit);
          
          this.sharedService.showNotification(true,Response.name,"the Store is Created");
          this.router.navigateByUrl('/')
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
    
    setTimeout(() => {
      this.activeStepSubject.next(1);
    }, 8000);
    // if(this.registerForm.valid){
    //   this.createUser(this.registerForm.value)
    // }
  }

  

   getToken(){
    const jwt=this.userServies.getJWT();
    return this.headers.set('Authorization','Bearer '+jwt)
   }
  getStores(){
    return this.http.get<StoreDetails[]>(`${environment.appUrl}/store/get-stores`)
  }
  getStore(id:string){
    return this.http.get<StoreAddEdit>(`${environment.appUrl}/store/get-store/${id}`)
  }
  getStoreByLink(link:string){
    return this.http.get<StoreAddEdit>(`${environment.appUrl}/store/get-store-link/${link}`)
  }
  // getApplicationRoles(){
  //   return this.http.get<string[]>(`${environment.appUrl}/store/get-application-roles`)
  // }

  addEditStore(model:StoreAddEdit){
    return this.http.post(`${environment.appUrl}/store/add-edit-store`,model,{headers:this.getToken()});
  }

  // lockMember(id:string){
  //   return this.http.put(`${environment.appUrl}/store/lock-member/${id}`,{},{headers:this.getToken()})
  // }

  // unlockMember(id:string){
  //   return this.http.put(`${environment.appUrl}/store/unlock-member/${id}`,{},{headers:this.getToken()})
  // }
  // deleteMember(id:string){
  //   return this.http.delete(`${environment.appUrl}/store/delete-member/${id}`,{headers:this.getToken()})
  // }
}
