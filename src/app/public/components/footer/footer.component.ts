import { Component } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css'],
    standalone: false
})
export class FooterComponent {
  constructor(private translate: TranslateService,private http: HttpClient){}
  currentYear=new Date().getFullYear()
  ngOnInit(): void {
    this.loadTranslations();
  }

  loadTranslations() {
    const lang = this.translate.currentLang || this.translate.getDefaultLang();
    this.http.get(`assets/i18n/${lang}/footer.json`).subscribe((res: any) => {
      this.translate.setTranslation(lang, res, true); // Merge translations
    });
  }
}
