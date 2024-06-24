import { Component } from '@angular/core';
import { TblUser } from 'src/app/models/TblUser';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent {
  title = 'SuperEcommere';

  users:TblUser[]=[]
  userToEdit?:TblUser

  constructor(private userServies:UsersService){
  }
  ngOnInit():void{


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
