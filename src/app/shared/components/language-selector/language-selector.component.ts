import { Component } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
    selector: 'app-language-selector',
    templateUrl: './language-selector.component.html',
    styleUrls: ['./language-selector.component.css'],
    standalone: false
})
export class LanguageSelectorComponent {
  languages = this.langService.getLanguages(); currentLang = this.langService.getCurrentLang();

  constructor(private langService: LanguageService) {
    console.log(this.languages)
  }
  
  changeLanguage(lang: string) { 
    this.langService.setLanguage(lang); this.currentLang = lang;
  }
  getFlag(langCode: string): string { 
    return this.languages.find(l => l.code === langCode)?.flag || '';
   }

getLabel(langCode: string): string { 
  return this.languages.find(l => l.code === langCode)?.label || ''; 
}


}




