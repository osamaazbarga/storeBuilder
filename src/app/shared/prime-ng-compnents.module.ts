import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../components/button/button.component';
import { ImportsPrimeNgModule } from './importsPrimeNg.module';



@NgModule({
  declarations: [
    ButtonComponent
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports:[
     ButtonComponent
  ] ,
  imports: [
    CommonModule,
    ImportsPrimeNgModule
    //ButtonComponent
  ]
})
export class PrimeNgCompnentsModule { }
