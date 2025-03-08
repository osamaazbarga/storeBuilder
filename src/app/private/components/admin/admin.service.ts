import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MemberAddEdit } from 'src/app/models/admin/memberAddEdit';
import { MemberView } from 'src/app/models/admin/memberView';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AdminService {
  headers:any=new HttpHeaders();
  constructor(private http:HttpClient,private userServies:UsersService) {

   }
   getToken(){
    const jwt=this.userServies.getJWT();
    return this.headers.set('Authorization','Bearer '+jwt)
   }
  getMembers(){
    return this.http.get<MemberView[]>(`${environment.appUrl}/Store/get-members`,{headers:this.getToken()})
  }
  getMember(id:string){
    return this.http.get<MemberAddEdit>(`${environment.appUrl}/Store/get-member/${id}`,{headers:this.getToken()})
  }
  getApplicationRoles(){
    return this.http.get<string[]>(`${environment.appUrl}/Store/get-application-roles`,{headers:this.getToken()})
  }

  addEditMember(model:MemberAddEdit){
    return this.http.post(`${environment.appUrl}/Store/add-edit-member`,model,{headers:this.getToken()});
  }

  lockMember(id:string){
    return this.http.put(`${environment.appUrl}/Store/lock-member/${id}`,{},{headers:this.getToken()})
  }

  unlockMember(id:string){
    return this.http.put(`${environment.appUrl}/Store/unlock-member/${id}`,{},{headers:this.getToken()})
  }
  deleteMember(id:string){
    return this.http.delete(`${environment.appUrl}/Store/delete-member/${id}`,{headers:this.getToken()})
  }


}
