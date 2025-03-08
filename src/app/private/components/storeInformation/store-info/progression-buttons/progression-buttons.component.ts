import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StoreInfoService } from '../../store-info.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-progression-buttons',
  templateUrl: './progression-buttons.component.html',
  styleUrls: ['./progression-buttons.component.scss']
})
export class ProgressionButtonsComponent implements OnInit {
  stepForm!: FormGroup;
  activeStep$?: number|undefined;
  errorMessages:string[]=[]

  constructor(private storeInfoService: StoreInfoService,private storeService:StoreService) { }

  ngOnInit(): void {
    this.stepForm = this.storeInfoService.stepForm;
    this.storeInfoService.activeStep$.subscribe(
      step => this.activeStep$ = step
    );
  }

  nextStep() {
    if ((this.activeStep$ == 1) && (this.stepForm.controls['personalDetails'].pristine) && (!this.stepForm.controls['personalDetails'].touched)) {
      // TO-DO => display error message if step 1 is skipped

      // console.log(this.stepForm.controls['personalDetails'].pristine, !this.stepForm.controls['personalDetails'].touched)

    } else {
      if(this.activeStep$ == 1&&this.stepForm.value.personalDetails.storeLink!=null){
        this.checkLinkAvalible(this.stepForm.value.personalDetails.storeLink)
        
        
      }
      else{
        this.storeInfoService.goToNextStep(this.activeStep$);

      }
      
    }



  }
  goBack() {
    this.storeInfoService.goBackToPreviousStep(this.activeStep$);
  }

  confirmAndSubmitForm() {
    this.storeInfoService.submit();

  }
  checkLinkAvalible(storeLink: any) {
    // this.submitted=true;
      this.errorMessages=[];
  
      this.storeService.getIsAvalibleLink(storeLink).subscribe({
        next:(res:any)=>{
          if(res==true){
            this.storeInfoService.goToNextStep(this.activeStep$);
          } 
          else{
            this.errorMessages.push("this link is unavalible");
          }     
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
  
}

