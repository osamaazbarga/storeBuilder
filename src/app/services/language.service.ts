import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  currentLang: string = 'ar';
  supportedLangs = [ { code: 'en', label: 'English', flag: '🇺🇸' }, { code: 'ar', label: 'العربية', flag: '🇸🇦' }, { code: 'he', label: 'עברית', flag: '🇮🇱' }, ];
  private langSubject = new BehaviorSubject<string>('ar');
  lang$ = this.langSubject.asObservable();


//   constructor(private translate: TranslateService) {
//     this.setLanguage(this.currentLang);
//   }
constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('lang') || 'ar';
    this.currentLang = savedLang;
    this.langSubject = new BehaviorSubject<string>(savedLang);
    this.lang$ = this.langSubject.asObservable();
    this.translate.addLangs(this.supportedLangs.map(l => l.code)); this.translate.setDefaultLang('ar');
    this.translate.use(savedLang); 
    document.documentElement.dir = savedLang === 'ar' || savedLang === 'he' ? 'rtl' : 'ltr'; 
    document.body.classList.remove('rtl', 'ltr');
    document.body.classList.remove('font-en', 'font-ar', 'font-he');
    document.body.classList.add(document.documentElement.dir);
    if (savedLang === 'ar') {
      document.body.classList.add('font-ar');
    } else if (savedLang === 'he') {
      document.body.classList.add('font-he');
    } else {
      document.body.classList.add('font-en');
    }
}

setLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    this.langSubject.next(lang);
    localStorage.setItem('lang', lang); 
    document.documentElement.dir = lang === 'ar' || lang === 'he' ? 'rtl' : 'ltr'; 
    document.body.classList.remove('rtl', 'ltr');
    document.body.classList.add(document.documentElement.dir);
    document.body.classList.remove('font-en', 'font-ar', 'font-he');
    if (lang === 'ar') {
      document.body.classList.add('font-ar');
    } else if (lang === 'he') {
      document.body.classList.add('font-he');
    } else {
      document.body.classList.add('font-en');
    }
}

getCurrentLang() { 
  return this.langSubject.value;
  return this.translate.currentLang; 

}

getLanguages() { return this.supportedLangs; }

//   setLanguage(lang: string) {
//     this.currentLang = lang;
//     this.translate.use(lang);
//     const dir = (lang === 'ar' || lang === 'he') ? 'rtl' : 'ltr';
//     document.documentElement.lang = lang;
//     document.documentElement.dir = dir;
//     document.body.classList.remove('rtl', 'ltr');
//     document.body.classList.add(dir);
//   }

//   getLanguage() {
//     return this.currentLang;
//   }
}
