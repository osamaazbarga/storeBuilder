import { Component } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  collapsed=true;
  constructor(public userService:UsersService){

  }
  logout(){
    this.userService.logout()
  }

  toggleCollapsed(){
    this.collapsed=!this.collapsed
  }

}
