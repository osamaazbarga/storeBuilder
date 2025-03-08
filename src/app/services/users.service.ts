import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { TblUser } from '../models/TblUser';
import { MatSnackBar } from '@angular/material/snack-bar';
import {catchError, map, tap} from 'rxjs/operators'
import { ReplaySubject, of, throwError } from 'rxjs';
import { Register } from '../models/account/register';
import { Login } from '../models/account/login';
import { User } from '../models/account/user';
import {  Router } from '@angular/router';
import { ConfirmEmail } from '../models/account/confirmEmail';
import { ResetPassword } from '../models/account/resetPassword';
import { RegisterWithExternal } from '../models/account/registerWithExternal';
import { LoginWithExternal } from '../models/account/loginWithExternal';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
  
})
export class UsersService {



  private url="Users";
  private userSource=new ReplaySubject<User|null>(1);
  user$=this.userSource.asObservable();
  constructor(private http:HttpClient,private snackbar:MatSnackBar,private router:Router) { }
  // getUsers():User[]{
  //   let user=new User();
  //   user.id=1;
  //   user.firstName='osama'
  //   user.lastName='azbarga'
  //   user.email='o.s.2@hotmail.com'
  //   user.password='1234'
  //   user.isDeleted=false
  //   user.username='taxi'
  //   // user.registerDate=Date.now
  //   return [user]

  // }


  public refreshUser(jwt:string|null){
    if(jwt===null){
      this.userSource.next(null);
      return of(undefined)
    }

    let headers=new HttpHeaders();
    headers=headers.set('Authorization','Bearer '+jwt)
    return this.http.get<User>(`${environment.appUrl}/${this.url}/refresh-user-token`,{headers}).pipe(
      map((user:User)=>{
        if(user){
          console.log(user);
          
          this.setUser(user)
        }
      })
    );
  }
  public login(model:Login){
    return this.http.post<User>(`${environment.appUrl}/${this.url}/login`,model).pipe(
      map((user:User)=>{
        if(user){
          this.setUser(user)
        }
      })
    );
  }

  loginWithThirdParty(model:LoginWithExternal){
    return this.http.post<User>(`${environment.appUrl}/${this.url}/login-with-third-party`,model).pipe(
      map((user:User)=>{
        if(user){
          this.setUser(user);
        }
      })
    )
  }
  logout(){
    localStorage.removeItem(environment.userKey);
    this.userSource.next(null);
    this.router.navigateByUrl('/');

  }

  public register(model:Register){
    return this.http.post(`${environment.appUrl}/${this.url}/register`,model);
  }

  public registerWithThirdParty(model:RegisterWithExternal){
    return this.http.post<User>(`${environment.appUrl}/${this.url}/registerWithThirdParty`,model).pipe(
      map((user:User)=>{
        if(user){
          this.setUser(user)
        }
      })
    );
  }

  public confirmEmail(model:ConfirmEmail){
    return this.http.put(`${environment.appUrl}/${this.url}/confirmEmail`,model)
  }

  public resendEmailConfirmationLink(email:string){
    return this.http.post(`${environment.appUrl}/${this.url}/resendEmailConfirmationLink/${email}`,{})
  }

  public forgetPassword(email:string){
    return this.http.post(`${environment.appUrl}/${this.url}/forgotPassword/${email}`,{})
  }

  public resetPassword(model:ResetPassword){
    return this.http.put(`${environment.appUrl}/${this.url}/resetPassword`,model)
  }


  


  getJWT(){
    const key=localStorage.getItem(environment.userKey);
    if(key){
      const user:User=JSON.parse(key);
      return user.jwt
    }
    return null;
  }
  private setUser(user:User){
    localStorage.setItem(environment.userKey,JSON.stringify(user));
    this.userSource.next(user);
  }


  public getUsers():Observable<TblUser[]>{
    return this.http.get<TblUser[]>(`${environment.appUrl}/${this.url}`)
    // return this.http.get<TblUser[]>(`${environment.appUrl}/${this.url}`);
  }
  public getUser(Id:string):Observable<TblUser>{
    return this.http.get<TblUser>(`${environment.appUrl}/${this.url}/${Id}`);
  }

  public createUser(user:TblUser):Observable<TblUser>{
    return this.http.post<TblUser>(`${environment.appUrl}/${this.url}`,user)
    .pipe(
      tap((createdUser:TblUser)=>this.snackbar.open(`User ${createdUser.username} created successfully`,'Close',{
        duration:2000,
        horizontalPosition:'right',
        verticalPosition:'top'
      })),
      catchError(e=>{
        this.snackbar.open(`User could not created ,due to :${e}`,'close',{
        duration:2000,
        horizontalPosition:'right',
        verticalPosition:'top'
        });
        return throwError(e)
      })
    );
    //return this.http.post<TblUser>(`${environment.appUrl}/${this.url}`,user)

  }

  public updateUser(Id:string,user:TblUser):Observable<TblUser>{
    return this.http.put<TblUser>(`${environment.appUrl}/${this.url}/${Id}`,user);
  }

  public deleteUser(Id:string):Observable<TblUser>{
    return this.http.delete<TblUser>(`${environment.appUrl}/${this.url}/${Id}`);
  }
}
