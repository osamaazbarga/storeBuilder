import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AddProduct } from '../models/products/addProduct';
import { Observable } from 'rxjs';
import { User } from '../models/account/user';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private url="Products";

  constructor(private http:HttpClient,private storeService:StoreService) { }

  getProducts(){
    this.http.get(`${environment.appUrl}/${this.url}`)
  }
  getProductsByStoreId(storeId:number){
    return this.http.get(`${environment.appUrl}/${this.url}/products-by-store-id/${storeId}`)
  }
  updateProduct(product:any){
    if(product.status=="draft"){
      product.status="published"
    }
    return this.http.put(`${environment.appUrl}/${this.url}/${product.id}`,product);
  }

  public createProdct(model:AddProduct){
    return this.http.post(`${environment.appUrl}/${this.url}`,model);
  }
  
  public createEmptyProdct(storeId:number){
    let jwt=null
    const key=localStorage.getItem(environment.userKey);
    if(key){
      const user:User=JSON.parse(key);
      jwt= user.jwt  
      
    }
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${jwt}`, // or whatever key you use
        'Content-Type': 'application/json'
      })
    return this.http.post(`${environment.appUrl}/${this.url}/empty-product?storeId=${storeId}`,{},{ headers });  

  }


  // public createEmptyProdct(){
  //   let jwt=null
  //   const key=localStorage.getItem(environment.userKey);
  //   if(key){
  //     const user:User=JSON.parse(key);
  //     jwt= user.jwt
  //     console.log(jwt);
      
  //   }
  //   return this.http.post(`${environment.appUrl}/${this.url}/empty-prodct`,jwt);
  // }

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


  getStoreByUserId(userId:string){
    //this.errorMessages=[];
    

      this.storeService.getStoreByUserId(userId).subscribe({
          next:(res:any)=>{
            console.log(res);
            
            if(res==true){
              return res.id
            } 
            else{
              //this.errorMessages.push("no Stores yet");
            }     
            // this.sharedService.showNotification(true,res.value.title,res.value.message);
            // this.router.navigateByUrl('/login')
          },
          error:error=>{
            if(error.error.errors){
              //this.errorMessages=error.error.errors
              
            }
            else{
              //this.errorMessages.push(error.error)
            }
            
          }
      })
    
  }
}
