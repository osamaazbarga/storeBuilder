import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../dashboard/shared.module";
import { MaterialModule } from "src/app/shared/material.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { StoreRoutingModule } from "./store-routing.module";
import { StoreComponent } from './store/store.component';

@NgModule({
    declarations: [
      
    
    StoreComponent
  ],
    imports: [
      CommonModule,
      StoreRoutingModule,
      ReactiveFormsModule,
      SharedModule,
      MaterialModule
    ]
  })
  export class StoreModule { }