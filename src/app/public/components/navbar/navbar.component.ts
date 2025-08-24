import { Component, HostListener, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { LanguageService } from 'src/app/services/language.service';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: false
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  collapsed=true;
  openDropdown: string | null = null;
  constructor(public userService:UsersService,public languageService: LanguageService){
  }


  ngOnInit() {
        this.items = [
            {
                label: "HOME",
                icon: 'pi pi-home',
            },
            {
                label: "SOLUTIONS",
                icon: 'pi pi-search',
                items: [
                    {
                        label: 'Core',
                        icon: 'pi pi-bolt',
                        shortcut: '⌘+S',
                    },
                    {
                        label: 'Blocks',
                        icon: 'pi pi-server',
                        shortcut: '⌘+B',
                    },
                    {
                        separator: true,
                    },
                    {
                        label: 'UI Kit',
                        icon: 'pi pi-pencil',
                        shortcut: '⌘+U',
                    },
                ],
            },
            {
                label: "RESOURCES",
                icon: 'pi pi-search',
                items: [
                    {
                        label: 'Core',
                        icon: 'pi pi-bolt',
                        shortcut: '⌘+S',
                    },
                    {
                        label: 'Blocks',
                        icon: 'pi pi-server',
                        shortcut: '⌘+B',
                    },
                    {
                        separator: true,
                    },
                    {
                        label: 'UI Kit',
                        icon: 'pi pi-pencil',
                        shortcut: '⌘+U',
                    },
                ],
            },
            {
                label: "PRICEING",
                icon: 'pi pi-search',
                items: [
                    {
                        label: 'Core',
                        icon: 'pi pi-bolt',
                        shortcut: '⌘+S',
                    },
                    {
                        label: 'Blocks',
                        icon: 'pi pi-server',
                        shortcut: '⌘+B',
                    },
                    {
                        separator: true,
                    },
                    {
                        label: 'UI Kit',
                        icon: 'pi pi-pencil',
                        shortcut: '⌘+U',
                    },
                ],
            },
           
        ];
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
