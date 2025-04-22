import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { ConfirmEmailComponent } from './components/users/confirm-email/confirm-email.component';
import { EditUserComponent } from './components/users/edit-user/edit-user.component';
import { LoginComponent } from './components/users/login/login.component';
import { RegisterWithThirdPartyComponent } from './components/users/register-with-third-party/register-with-third-party.component';
import { RegisterComponent } from './components/users/register/register.component';
import { ResetPasswordComponent } from './components/users/reset-password/reset-password.component';
import { SendEmailComponent } from './components/users/send-email/send-email.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ButtonModule } from 'primeng/button';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from './components/auth/auth.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    EditUserComponent,
    ConfirmEmailComponent,
    SendEmailComponent,
    ResetPasswordComponent,
    RegisterWithThirdPartyComponent,
    AuthComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        FormsModule,
        MatSnackBarModule,
        SharedModule,
        MaterialModule,
        MatGridListModule,
        TranslateModule
        
        
        
  ]
})
export class AuthModule { }
