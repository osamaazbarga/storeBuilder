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
import { FooterNavComponent } from './components/home-parts/footer-nav/footer-nav.component';
import { StartNowComponent } from './components/home-parts/start-now/start-now.component';
import { FirstHomePartComponent } from './components/home-parts/first-home-part/first-home-part.component';
import { FeaturesSectionComponent } from './components/home-parts/features-section/features-section.component';
import { StatisticsSectionComponent } from './components/home-parts/statistics-section/statistics-section.component';



@NgModule({
  declarations: [
    
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    ViewComponent,
    StoreComponent,
    FooterNavComponent,
    StartNowComponent,
    FirstHomePartComponent,
    FeaturesSectionComponent,
    StatisticsSectionComponent
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
