import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RestaurantViewerComponent } from './pages/restaurant-viewer/restaurant-viewer.component';
import { RestaurantsViewComponent } from './components/restaurants-view/restaurants-view.component';
import { PersonViewComponent } from './components/person-view/person-view.component';
import { CreateRestaurantComponent } from './pages/create-restaurant/create-restaurant.component';
import { ErrorHandlerService } from './services/error-handler.service';
import { ErrorsViewerComponent } from './components/errors-viewer/errors-viewer.component';
import { MessagesViewerComponent } from './components/messages-viewer/messages-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    RestaurantViewerComponent,
    RestaurantsViewComponent,
    PersonViewComponent,
    CreateRestaurantComponent,
    ErrorsViewerComponent,
    MessagesViewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: ErrorHandler, useClass: ErrorHandlerService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
