import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private url="Products";

  constructor(private http:HttpClient) { }

  getProducts(){
    this.http.get(`${environment.apiUrl}/${this.url}`)
  }
}
