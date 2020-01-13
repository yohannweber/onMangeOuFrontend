import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RestaurantViewerComponent } from './pages/restaurant-viewer/restaurant-viewer.component';
import { RestaurantsViewComponent } from './components/restaurants-view/restaurants-view.component';
import { PersonViewComponent } from './components/person-view/person-view.component';
import { CreateRestaurantComponent } from './pages/create-restaurant/create-restaurant.component';

@NgModule({
  declarations: [
    AppComponent,
    RestaurantViewerComponent,
    RestaurantsViewComponent,
    PersonViewComponent,
    CreateRestaurantComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
