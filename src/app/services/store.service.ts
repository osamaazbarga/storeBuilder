import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private url="Store";

  constructor(private http:HttpClient) { }

  getStores(){
    this.http.get(`${environment.appUrl}/${this.url}`)
  }
  getIsAvalibleLink(link:string){
    return this.http.get(`${environment.appUrl}/${this.url}/check-availble-link/${link}`)
  }
}
