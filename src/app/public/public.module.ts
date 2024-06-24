import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { LoginComponent } from './components/users/login/login.component';
import { RegisterComponent } from './components/users/register/register.component';
import { EditUserComponent } from './components/users/edit-user/edit-user.component';
import { HomeComponent } from './components/home/home.component';
import {MatCardModule} from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SharedModule } from '../shared/shared.module';
import { ConfirmEmailComponent } from './components/users/confirm-email/confirm-email.component';
import { SendEmailComponent } from './components/users/send-email/send-email.component';
import { ResetPasswordComponent } from './components/users/reset-password/reset-password.component';
import { RegisterWithThirdPartyComponent } from './components/users/register-with-third-party/register-with-third-party.component';
import { ViewComponent } from './components/view/view.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    EditUserComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    ConfirmEmailComponent,
    SendEmailComponent,
    ResetPasswordComponent,
    RegisterWithThirdPartyComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    SharedModule
  ]
})
export class PublicModule { }
