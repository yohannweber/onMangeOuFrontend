import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RestaurantViewerComponent } from './pages/restaurant-viewer/restaurant-viewer.component';
import { CreateRestaurantComponent } from './pages/create-restaurant/create-restaurant.component';


const routes: Routes = [
  {path: '', component: RestaurantViewerComponent},
  {path: 'new/restaurant', component: CreateRestaurantComponent} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
