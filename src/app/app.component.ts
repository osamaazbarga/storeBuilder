import { Component, OnInit } from '@angular/core';
import { UsersService } from './services/users.service';
import { SharedService } from './shared/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private userServies:UsersService,
    private sharedService:SharedService
  ){
    
  }
  ngOnInit():void{
    this.refreshUser()

  }
  private refreshUser(){
    const jwt=this.userServies.getJWT();
    if(jwt){
      this.userServies.refreshUser(jwt).subscribe({
        next:_=>{

        },
        error:error=>{
          this.userServies.logout();
          if(error.status===401){
            this.sharedService.showNotification(false,'Account blocked',error.error)
          }
        }

      })


    }else{
      this.userServies.refreshUser(null).subscribe()
    }
  }
}
