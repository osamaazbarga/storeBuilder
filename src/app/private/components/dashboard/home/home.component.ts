import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { User } from 'src/app/models/account/user';
import { StoreService } from 'src/app/services/store.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  errorMessages:string[]=[]
  mode:string|undefined;
  constructor(private storeService:StoreService,private userService:UsersService,private activatedRoute:ActivatedRoute){
    this.userService.user$.pipe(take(1)).subscribe({
          next:(user:User|null)=>{
            if(user){
                this.getStoreByUserId(user.id!)
            }
            else{
              const mode=this.activatedRoute.snapshot.paramMap.get('mode');
              if(mode){
                this.mode=mode
                console.log(this.mode);
              }             
            }
          }
        })
  }

  getStoreByUserId(userId:string){
    this.errorMessages=[];
    

      this.storeService.getStoreByUserId(userId).subscribe({
          next:(res:any)=>{
            console.log(res);
            
            if(res==true){
              
            } 
            else{
              this.errorMessages.push("no Stores yet");
            }     
            // this.sharedService.showNotification(true,res.value.title,res.value.message);
            // this.router.navigateByUrl('/login')
          },
          error:error=>{
            if(error.error.errors){
              this.errorMessages=error.error.errors
              
            }
            else{
              this.errorMessages.push(error.error)
            }
            
          }
      })
    
  }
}
