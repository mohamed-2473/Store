import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AllProductsComponent } from './components/all-products/all-products.component';
import { SingleProductComponent } from './components/single-product/single-product.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'products', component: AllProductsComponent },
  { path: 'single-product/:id', component: SingleProductComponent },
  { path: 'product/:id', component: SingleProductComponent }, // Alternative route
  { path: '**', redirectTo: '' } // Redirect to home for unknown routes
];