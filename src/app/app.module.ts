import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpBackend, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './shared/material.module';
import { ButtonModule } from 'primeng/button';
import {MatGridListModule} from '@angular/material/grid-list';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageService } from './services/language.service';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



export function HttpLoaderFactory(http: HttpBackend) {
  
  return new MultiTranslateHttpLoader(http, [
     { prefix: './assets/i18n/', suffix: '/nav.json' },
    { prefix: './assets/i18n/', suffix: '/auth.json' },
    { prefix: './assets/i18n/', suffix: '/dashboard.json' },

  ]);
  
}

@NgModule({ declarations: [
        AppComponent,
    ],
    bootstrap: [AppComponent], imports: [ButtonModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        SharedModule,
        MaterialModule,
        MatGridListModule,
        TranslateModule.forRoot({
            defaultLanguage: 'en',
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpBackend]
            }
        }),
        NgbModule], providers: [LanguageService, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
