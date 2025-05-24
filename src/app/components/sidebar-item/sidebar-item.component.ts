import { Component, Input } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
    selector: 'app-sidebar-item',
    templateUrl: './sidebar-item.component.html',
    styleUrls: ['./sidebar-item.component.css'],
    standalone: false
})
export class SidebarItemComponent {
  @Input() item: any;
  constructor(public languageService: LanguageService){
    
  }
}
