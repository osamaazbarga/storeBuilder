import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from 'src/app/guards/auth.guard';
import { StoreInfoComponent } from './store-info/store-info.component';


const routes: Routes = [

  {
    path:'',
    runGuardsAndResolvers:'always',
    //canActivate:[AuthorizationGuard],
    component:StoreInfoComponent

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreInfoRoutingModule { }
