import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MsalAuthService } from './msal-auth.service';
import { Restaurant, Person } from './onmangeou.service';
import { ErrorHandlerService } from './error-handler.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private restaurantUrl = "http://localhost:3000/api/restaurants/";
  private _voted: boolean = true;
  private _restaurantVotedId: Restaurant["id"];
  private _userSubject = new Subject<Person>();

  constructor(private auth: MsalAuthService, private httpClient: HttpClient, private errorHandler: ErrorHandlerService) {
    this._voted = false;

    // Create persons observer object
    const myRestaurantObserver = {
      next: (x: Restaurant) => {
        this._voted;
        this._restaurantVotedId = x.id;
        console.log("id rest : " + x.id);
      },
      error: err => {
        this.errorHandler.handleError(err);
        this._restaurantVotedId = ""
      },
      complete: () => console.log('Restaurants Observer got a complete notification '),
    };

      console.log("auth is logon juste avant l'appel au serveur");
      //console.log("id : " + this.auth.data.id);
      //this.httpClient.get<Restaurant>("http://localhost:3000/api/surveys/" + this.auth.data.id + '/restaurant/')
      this.httpClient.get<Restaurant>("http://localhost:3000/api/surveys/" + 'c94c675f-6f35-41b1-b19a-b4b8797edacd' + '/restaurant/')
        .subscribe(myRestaurantObserver);
  }

  public isLogon(): boolean {
    return this.auth.isLogon;
  }

  public vote(restaurant: Restaurant["id"], comment?: string) {
    let person: Person = {
      id: this.auth.data.id,
      name: this.auth.data.displayName,
      comment: comment
    }
    this._restaurantVotedId = restaurant;


    // Create persons observer object
    const myPersonObserver = {
      next: (x: Person) => {
        console.log("voted !");
        this._voted = true;
        this._userSubject.next(x);
      },
      error: err => {
        this.errorHandler.handleError(err);
        this._restaurantVotedId = ""
      },
      complete: () => console.log('Restaurants Observer got a complete notification '),
    };

    if (this.auth.isLogon === true)
      this.httpClient.post<Person>(this.restaurantUrl + restaurant + '/surveys/', person)
        .subscribe(myPersonObserver)
  }

  public get voted(): boolean {
    return this._voted;
  }

  public get userSubject(): Subject<Person> {
    return this._userSubject;
  }
  public get restaurantVotedId(): Restaurant["id"] {
    return this._restaurantVotedId;
  }
}
