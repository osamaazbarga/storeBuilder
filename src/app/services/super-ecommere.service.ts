import { Injectable } from '@angular/core';
import { SuperEcommere } from '../models/super-ecommere';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuperEcommereService {
  url="SuperEcommere";
  constructor(private http:HttpClient) { }

  public getSuperEcommeres():Observable<SuperEcommere[]>{
    return this.http.get<SuperEcommere[]>(`${environment.apiUrl}/${this.url}`);
  }

  public createSuperEcommeres(ecomm:SuperEcommere):Observable<SuperEcommere[]>{
    return this.http.post<SuperEcommere[]>(`${environment.apiUrl}/${this.url}`,ecomm);
  }

  public updateSuperEcommeres(ecomm:SuperEcommere):Observable<SuperEcommere[]>{
    return this.http.put<SuperEcommere[]>(`${environment.apiUrl}/${this.url}`,ecomm);
  }

  public deleteSuperEcommeres(ecomm:SuperEcommere):Observable<SuperEcommere[]>{
    return this.http.delete<SuperEcommere[]>(`${environment.apiUrl}/${this.url}/${ecomm.id}`);
  }
}
