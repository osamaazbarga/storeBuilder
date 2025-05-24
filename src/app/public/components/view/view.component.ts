import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TblUser } from 'src/app/models/TblUser';
import { StoreService } from 'src/app/services/store.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
    selector: 'app-view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.css'],
    standalone: false
})
export class ViewComponent {
  title = 'SuperEcommere';

  users:TblUser[]=[]
  userToEdit?:TblUser
  isStoreView = false;
  isLoginPage = false;
  
  constructor(private userServies:UsersService,private storeService:StoreService,private router:Router){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.isLoginPage = url === '/login';
      }
    });
    const hostname = window.location.hostname; // test12.localtest.me
    const parts = hostname.split('.');

    // If subdomain is present and not "www" or "localhost"
    if (hostname!="localtest.me"&&parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
      if (hostname) {
        this.storeService.loadStoreBySubdomain(parts[0]).subscribe({
          next: (store) => this.isStoreView = true,
          error: (err) => window.location.href='http://localtest.me:4200'
        });
      }
    }
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
