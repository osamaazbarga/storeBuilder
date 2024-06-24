import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { ValidationMessagesComponent } from './components/errors/validation-messages/validation-messages.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotificaionComponent } from './components/modals/notificaion/notificaion.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UserHasRoleDirective } from './directives/user-has-role.directive';




@NgModule({
  declarations: [
    NotFoundComponent,
    ValidationMessagesComponent,
    NotificaionComponent,
    UserHasRoleDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
  ],
  exports:[
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    ValidationMessagesComponent,

  ]
})
export class SharedModule { }
