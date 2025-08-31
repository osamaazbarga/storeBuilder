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
import { StoreService } from './store.service';


@Injectable({
  providedIn: 'root',
  
})
export class UsersService {



  private url="users";
  private userSource=new ReplaySubject<User|null>(1);
  user$=this.userSource.asObservable();
  constructor(
    private http:HttpClient,
    private snackbar:MatSnackBar,
    private router:Router,
    private storeService:StoreService
  ) { }
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
      return of(null)
    }

    let headers=new HttpHeaders();
    headers=headers.set('Authorization','Bearer '+jwt)
    return this.http.get<User>(`${environment.appUrl}/${this.url}/refresh-user-token`,{headers}).pipe(
      map((user:User)=>{
        if(user && user.token){
          console.log('User refreshed:', user);
          this.setUser(user)
          return user;
        }
        return user;
      })
    );
  }
  public login(model:Login){
    return this.http.post<{token: string, user: User}>(`${environment.appUrl}/${this.url}/login`,model).pipe(
      map((response)=>{
        if(response && response.token){
          // Store only the token
          this.setToken(response.token);
          // Emit user data for components
          this.userSource.next(response.user);
          return response;
        }
        return response;
      })
    );
  }

  loginWithThirdParty(model:LoginWithExternal){
    return this.http.post<User>(`${environment.appUrl}/${this.url}/login-with-third-party`,model).pipe(
      map((user:User)=>{
        if(user && user.token){
          this.setUser(user);
          return user;
        }
        return user;
      })
    )
  }
  logout(){
    this.removeToken();
    this.userSource.next(null);
    // مسح بيانات المتجر من localStorage
    this.storeService.clearStoreData();
    this.router.navigateByUrl('/');
  }

  public register(model:Register){
    return this.http.post(`${environment.appUrl}/${this.url}/register`,model);
  }

  public registerWithThirdParty(model:RegisterWithExternal){
    return this.http.post<User>(`${environment.appUrl}/${this.url}/registerWithThirdParty`,model).pipe(
      map((user:User)=>{
        if(user && user.token){
          this.setUser(user)
          return user;
        }
        return user;
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
    return sessionStorage.getItem('auth_token');
  }

  setToken(token: string){
    sessionStorage.setItem('auth_token', token);
  }

  removeToken(){
    sessionStorage.removeItem('auth_token');
  }
  private setUser(user:User){
    if(user && user.token){
      // Store only the token in sessionStorage
      this.setToken(user.token);
      // Emit user data for components that need it
      this.userSource.next(user);
    } else {
      console.error('Invalid user data or missing token');
    }
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
