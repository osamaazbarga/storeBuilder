import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './dashboard/home/home.component';
import { AdminGuard } from 'src/app/shared/guards/admin.guard';
import { AddEditMemberComponent } from './add-edit-member/add-edit-member.component';

const routes:Routes=[
  {
    path:'',
    runGuardsAndResolvers:'always',
    canActivate:[AdminGuard],
    component:AdminHomeComponent

  },
  {
    path:'add-edit-member',
    runGuardsAndResolvers:'always',
    canActivate:[AdminGuard],
    component:AddEditMemberComponent,
  },
  {
    path:'add-edit-member/:id',
    runGuardsAndResolvers:'always',
    canActivate:[AdminGuard],
    component:AddEditMemberComponent,
  }

]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class AdminRoutingModule { }
