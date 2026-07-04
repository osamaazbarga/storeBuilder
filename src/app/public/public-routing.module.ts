import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/users/login/login.component';
import { RegisterComponent } from './components/users/register/register.component';
import { ConfirmEmailComponent } from './components/users/confirm-email/confirm-email.component';
import { SendEmailComponent } from './components/users/send-email/send-email.component';
import { ResetPasswordComponent } from './components/users/reset-password/reset-password.component';
import { RegisterWithThirdPartyComponent } from './components/users/register-with-third-party/register-with-third-party.component';
import { VerifyOtpComponent } from './components/users/verify-otp/verify-otp.component';
import { PublicHomeComponent } from './components/home/public-home.component';
import { StoreCheckoutComponent } from '../private/components/store/store/pages/store-checkout/store-checkout.component';
import { StoreOrderConfirmationComponent } from '../private/components/store/store/pages/store-order-confirmation/store-order-confirmation.component';
import { StoreProductDetailComponent } from '../private/components/store/store/pages/store-product-detail/store-product-detail.component';

const routes: Routes = [
  {
    path:'',
    component:PublicHomeComponent
  },
  {
    path:'checkout',
    component:StoreCheckoutComponent
  },
  {
    path:'order-confirmation/:orderNumber',
    component:StoreOrderConfirmationComponent
  },
  {
    path:'product/:id',
    component:StoreProductDetailComponent
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
    path:'verify-otp',
    component:VerifyOtpComponent
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
