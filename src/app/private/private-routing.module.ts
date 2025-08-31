import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/dashboard/home/home.component';
import { MainComponent } from './components/dashboard/pages/main/main.component';
import { ProductsComponent } from './components/dashboard/pages/products/products.component';
import { AddProductComponent } from './components/dashboard/pages/products/add-product/add-product.component';
import { CategoriesComponent } from './components/dashboard/pages/products/categories/categories.component';

const routes: Routes = [
  {
    path:'',
    runGuardsAndResolvers:'always',
    component:MainComponent
  },
  {
    path:'products',
    runGuardsAndResolvers:'always',
    component:ProductsComponent
  },
  {
    path:'products/addproduct',
    runGuardsAndResolvers:'always',
    component:AddProductComponent
  },
  {
    path:'categories',
    runGuardsAndResolvers:'always',
    component:CategoriesComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AddProductComponent
  ],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
