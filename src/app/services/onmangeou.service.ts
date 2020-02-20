import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

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

  private restaurantUrl = environment.apiEndpoint + "restaurants/";
  private oldRestaurantUrl = environment.apiEndpoint + "oldRestaurants/";
  private surveyUrl = environment.apiEndpoint + "surveys/";
  private handleError = "";

  constructor(private httpClient: HttpClient) {
   }

  public getAllRestaurants(): Observable<Restaurant[]>{
    return this.httpClient.get<Restaurant[]>(this.restaurantUrl);
  }
  public getAllOldRestaurants(): Observable<Restaurant[]>{
    return this.httpClient.get<Restaurant[]>(this.oldRestaurantUrl);
  }

  public getAllPersons(restaurant: Restaurant ): Observable<Person[]>{
    return this.httpClient.get<Person[]>(this.surveyUrl + restaurant.id);
  }

  addRestaurant (restaurant: Restaurant): Observable<Restaurant> {
    return this.httpClient.post<Restaurant>(this.restaurantUrl, restaurant)
  }
}
