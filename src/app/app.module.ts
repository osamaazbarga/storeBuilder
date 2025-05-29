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
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';



export function HttpLoaderFactory(http: HttpBackend) {
  
  return new MultiTranslateHttpLoader(http, [
     { prefix: './assets/i18n/', suffix: '/nav.json' },
    { prefix: './assets/i18n/', suffix: '/auth.json' },
    { prefix: './assets/i18n/', suffix: '/dashboard.json' },
    { prefix: './assets/i18n/', suffix: '/product.json' },


  ]);
  
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    ButtonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    SharedModule,
    MaterialModule,
    // NgMultiSelectDropDownModule.forRoot(),
    MatGridListModule,
    // HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend]
      }
    }),

  
  ],
  providers: [LanguageService,
    provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Aura
            }
        })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
