import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/users/login/login.component';
import { RegisterComponent } from './components/users/register/register.component';
import { ConfirmEmailComponent } from './components/users/confirm-email/confirm-email.component';
import { SendEmailComponent } from './components/users/send-email/send-email.component';
import { ResetPasswordComponent } from './components/users/reset-password/reset-password.component';
import { RegisterWithThirdPartyComponent } from './components/users/register-with-third-party/register-with-third-party.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path:'',
    component:HomeComponent
  },
  
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
  {
    path:'users/confirmEmail',
    component:ConfirmEmailComponent
  },
  {
    path:'sendEmail/:mode',
    component:SendEmailComponent
  },
  {
    path:'users/resetPassword',
    component:ResetPasswordComponent
  },
  {
    path:'register/thirdParty/:provider',
    component:RegisterWithThirdPartyComponent
  },


  // {
  //   path:'**',
  //   component:NotFoundComponent,
  //   pathMatch:'full'
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
