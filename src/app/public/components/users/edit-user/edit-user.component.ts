import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TblUser } from 'src/app/models/TblUser';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  userDetailes:TblUser=new TblUser()
  form!: FormGroup;
  constructor(private userService:UsersService,private route:ActivatedRoute,private router:Router){

  }

  ngOnInit():void{
    this.form = new FormGroup({
      // firstName: new FormControl()
  });
    this.route.paramMap.subscribe({
      next:(params)=>{
        const id=params.get('id')
        if(id){
          this.userService.getUser(id)
          .subscribe({
            next:(res)=>{
              this.userDetailes=res
              console.log(this.userDetailes);
              
            }
          })
        }
      }
    })
  }

  updateUser(){
    this.userService.updateUser(<string>this.userDetailes.id,this.userDetailes).subscribe({
      next:(res)=>{
        console.log(res);
        
        this.router.navigate(['/'])
        
      }
    })
    

  }

  deleteUser(id:string){
    this.userService.deleteUser(id).subscribe({
      next:(res)=>{

        this.router.navigate(['/'])
        
      }
    })
    

  }

}
