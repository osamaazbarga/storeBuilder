import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { ValidationMessagesComponent } from './components/errors/validation-messages/validation-messages.component';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NotificaionComponent } from './components/modals/notificaion/notificaion.component';
// import { ModalModule } from 'ngx-bootstrap/modal';
import { UserHasRoleDirective } from './directives/user-has-role.directive';
import { ButtonModule } from 'primeng/button';
import { ImportsPrimeNgModule } from './importsPrimeNg.module';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { ButtonLinkComponent } from '../components/button-link/button-link.component';

import { AngularPinturaModule } from '@pqina/angular-pintura';




@NgModule({ 
  declarations: [
        NotFoundComponent,
        ValidationMessagesComponent,
        NotificaionComponent,
        UserHasRoleDirective,
        LanguageSelectorComponent,
        ButtonLinkComponent
    ],
    exports: [
        RouterModule,
        ReactiveFormsModule,
        ValidationMessagesComponent,
        ImportsPrimeNgModule,
        LanguageSelectorComponent,
        ButtonLinkComponent
        
    ], 
    imports: [
      CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MatGridListModule,
        ImportsPrimeNgModule,
        RouterLink,
        RouterOutlet,
        AngularPinturaModule
        // FilePondModule,
        // ModalModule.forRoot()
    ], 
    providers: [provideHttpClient(withInterceptorsFromDi())] 
  })
export class SharedModule { }
