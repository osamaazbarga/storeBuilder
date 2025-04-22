import { Component, HostListener } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  collapsed=true;
  openDropdown: string | null = null;
  constructor(public userService:UsersService,public languageService: LanguageService){
  }

  isScrolled = false;
  isHovered = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 0;
  }
  logout(){
    this.userService.logout()
  }
  switchLang(lang: string) {
    this.languageService.setLanguage(lang);
  }
  toggleCollapsed(){
    this.collapsed=!this.collapsed
  }

  

}
