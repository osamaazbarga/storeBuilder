import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AddProduct } from '../models/products/addProduct';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private url="Products";

  constructor(private http:HttpClient) { }

  getProducts(){
    this.http.get(`${environment.appUrl}/${this.url}`)
  }

  public createProdct(model:AddProduct){
    return this.http.post(`${environment.appUrl}/${this.url}`,model);
  }

  upload(file: File): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    return this.http.post(`${environment.appUrl}/${this.url}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

  }

  getFiles(): Observable<any> {
    return this.http.get(`${environment.appUrl}/${this.url}/files`);
  }
}
