import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/dashboard/home/home.component';
import { MainComponent } from './components/dashboard/pages/main/main.component';

const routes: Routes = [
  {
    path:'',
    component:MainComponent
  },
  // {
  //   path:'**',
  //   redirectTo:'',
  //   pathMatch:'full'
  // }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
