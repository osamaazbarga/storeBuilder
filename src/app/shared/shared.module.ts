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
import { ButtonModule } from 'primeng/button';
import { ImportsPrimeNgModule } from './importsPrimeNg.module';
import { PrimeNgCompnentsModule } from './prime-ng-compnents.module';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { ButtonLinkComponent } from '../components/button-link/button-link.component';


@NgModule({
  declarations: [
    NotFoundComponent,
    ValidationMessagesComponent,
    NotificaionComponent,
    UserHasRoleDirective,
    LanguageSelectorComponent,
    ButtonLinkComponent

    
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatGridListModule,
    ModalModule.forRoot()
  ],
  exports:[
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    ValidationMessagesComponent,
    ImportsPrimeNgModule,
    LanguageSelectorComponent,
    ButtonLinkComponent

  ]
})
export class SharedModule { }
