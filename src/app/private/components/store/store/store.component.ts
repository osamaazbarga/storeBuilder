import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { StoreInfoService } from '../../storeInformation/store-info.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit{

  constructor(private sharedService:SharedService,
    private formBuilder:FormBuilder,
    private router:Router,
    private activedRoute:ActivatedRoute,
    private storeService:StoreInfoService){}
  ngOnInit(): void {
    const link=this.activedRoute.snapshot.paramMap.get('link');
    if(link){
      //this.addNew=false;
      this.getStoreByLink(link);
    }
    else{
      //this.initializeForm(undefined);
    }

    //this.getRoles();

  }

  getStoreByLink(link:string){
    this.storeService.getStoreByLink(link).subscribe({
      next:store=>{
        console.log(store);
        
        //this.initializeForm(member);
      }
    })
  }
}
