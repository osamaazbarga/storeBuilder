import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { StoreInfoService } from '../../storeInformation/store-info.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
    selector: 'app-store',
    templateUrl: './store.component.html',
    styleUrls: ['./store.component.css'],
    standalone: false
})
export class StoreComponent implements OnInit{
  store: any;
  constructor(private sharedService:SharedService,
    private formBuilder:FormBuilder,
    private router:Router,
    private activedRoute:ActivatedRoute,
    private storeServiceInfo:StoreInfoService,
    private storeService:StoreService
  ){}
  ngOnInit(): void {
    const link=this.activedRoute.snapshot.paramMap.get('link');
    if(link){
      //this.addNew=false;
      this.getStoreByLink(link);
    }
    else{
      //this.initializeForm(undefined);
    }

    const subdomain = this.storeService.getSubdomain();

    if (subdomain) {
      this.storeService.loadStoreBySubdomain(subdomain).subscribe({
        next: (store) => this.store = store,
        error: (err) => console.error('Store not found', err)
      });
    }

    //this.getRoles();

  }

  getStoreByLink(link:string){
    this.storeServiceInfo.getStoreByLink(link).subscribe({
      next:store=>{
        console.log(store);
        
        //this.initializeForm(member);
      }
    })
  }

  


}
