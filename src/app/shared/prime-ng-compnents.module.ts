import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../components/button/button.component';
import { ImportsPrimeNgModule } from './importsPrimeNg.module';
import { DialogComponent } from '../components/primeNG-components/dialog/dialog.component';



@NgModule({
  declarations: [
    ButtonComponent,
    DialogComponent
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports:[
     ButtonComponent,
     DialogComponent
  ] ,
  imports: [
    CommonModule,
    ImportsPrimeNgModule
    //ButtonComponent
  ]
})
export class PrimeNgCompnentsModule { }
