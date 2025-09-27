import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { authGuard } from './guards/auth.guard';
import { NotFoundComponent } from './shared/components/errors/not-found/not-found.component';
import { HomeComponent as dashboardPrivateComponents } from './private/components/dashboard/home/home.component';
import { AdminHomeComponent as dashboardAdminComponents} from './private/components/admin/dashboard/home/home.component';

import { ViewComponent as publicComponents } from './public/components/view/view.component';
import { AuthorizationGuard } from './shared/guards/authorization.guard';
import { AdminGuard } from './shared/guards/admin.guard';
import { AdminViewComponent } from './private/components/admin/admin-view/admin-view.component';





const routes: Routes = [
  // {
  //   path:'',
  //   component:HomeComponent
  // },
  {
    path:'dashboard',
    // canActivate:[AuthorizationGuard],
    runGuardsAndResolvers:'always',
    component:dashboardPrivateComponents,
    loadChildren:()=>import('./private/private.module').then(m=>m.PrivateModule)
  },
  {
    path:'admin',
    runGuardsAndResolvers:'always',
    canActivate:[AdminGuard],
    component:AdminViewComponent,
    loadChildren:()=>import('./private/components/admin/admin.module').then(m=>m.AdminModule)
  },
  {
    path:'store-info',
    runGuardsAndResolvers:'always',
    // canActivate:[AuthorizationGuard],
    loadChildren:()=>import('./private/components/storeInformation/store-info.module').then(m=>m.StoreInfoModule)
  },
  {
    path:'',
    component:publicComponents,
    loadChildren:()=>import('./public/public.module').then(m=>m.PublicModule)
  },

  // {
  //   path: 'auth',
  //   component:AuthComponent,
  //   loadChildren: () => import('./public/auth.module').then(m => m.AuthModule)
  // },
  // {
  //   path:'',
  //   component:StoreComponent,
  //   //loadChildren:()=>import('./private/components/store/store.module').then(m=>m.StoreModule)
  // },
  {
    path:'not-found',
    component:NotFoundComponent
  },

  {
    path:'**',
    component:NotFoundComponent,
    pathMatch:'full'
  },

  // {
  //   path:'user/edit/:id',
  //   component:EditUserComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
