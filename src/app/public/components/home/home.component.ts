import { Component } from '@angular/core';
import { TblUser } from 'src/app/models/TblUser';
import { StoreService } from 'src/app/services/store.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: false
})
export class HomeComponent {
  title = 'SuperEcommere';

  users:TblUser[]=[]
  userToEdit?:TblUser
  isStoreView = false;

  constructor(private userServies:UsersService,private storeService:StoreService){
  }
  ngOnInit():void{

    const hostname = window.location.hostname; // test12.localtest.me
    const parts = hostname.split('.');

    // If subdomain is present and not "www" or "localhost"
    if (parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
      this.isStoreView = true;
    }
    // this.superEcommereServies.getSuperEcommeres().subscribe((result:SuperEcommere[])=>{
    //   this.heroes=result
    // });
    // this.users=this.userServies.getUsers()
    // console.log(this.users);
    
    this.userServies.getUsers().subscribe(
      // {
      //   next(userss?:any) {
      //     this.users=userss
      //   },
      //   error(response){

      //   }
      // }

      (result:TblUser[])=>{
      
      
      this.users=result
      console.log(this.users);
    }
    );
  }

  updateEcommList(ecommeres:TblUser[]){
    this.users=ecommeres
  }
  // initNewEcomm(){
  //   this.ecommToEdit=new SuperEcommere()
  //   console.log("initNewEcomm",this.ecommToEdit)
  // }

  // editEcomm(ecomm:SuperEcommere){
  //   this.ecommToEdit=ecomm
  // }

  editUser(ecomm:TblUser){

    
    this.userToEdit=ecomm
  }
}
