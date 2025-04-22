import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './components/home/home.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SharedModule } from '../shared/shared.module';
import { ViewComponent } from './components/view/view.component';

import {  TranslateModule } from '@ngx-translate/core';

import { StoreComponent } from '../private/components/store/store/store.component';



@NgModule({
  declarations: [
    
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    ViewComponent,
    StoreComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    SharedModule,
    TranslateModule
  ],
})
export class PublicModule { }
