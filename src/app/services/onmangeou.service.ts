import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestaurantViewerComponent } from '../pages/restaurant-viewer/restaurant-viewer.component';

export interface Person{
  id: string,
  name: string,
  comment: string
}
export interface Restaurant{
  id: string,
  name: string,
  type: string,
  descr: string
  persons: Array<Person>
}


@Injectable({
  providedIn: 'root'
})
export class OnmangeouService {

  private restaurantUrl = "http://localhost:3000/api/restaurants";
  private handleError = "";

  constructor(private httpClient: HttpClient) { }

  public getAllRestaurants(): Observable<Restaurant[]>{
    return this.httpClient.get<Restaurant[]>(this.restaurantUrl);
  }

  public getAllPersons(restaurant: Restaurant ): Observable<Person[]>{
    return this.httpClient.get<Person[]>("http://localhost:3000/api/surveys/" + restaurant.id);
  }

  addRestaurant (restaurant: Restaurant): Observable<Restaurant> {
    return this.httpClient.post<Restaurant>(this.restaurantUrl, restaurant)
  }
}
