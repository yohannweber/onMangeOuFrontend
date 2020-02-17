import { Component, OnInit, Input } from '@angular/core';
import { OnmangeouService, Person, Restaurant } from 'src/app/services/onmangeou.service';
import { MsalAuthService } from 'src/app/services/msal-auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService, message } from 'src/app/services/message-handler.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-restaurant-viewer',
  templateUrl: './restaurant-viewer.component.html',
  styleUrls: ['./restaurant-viewer.component.scss']
})
export class RestaurantViewerComponent implements OnInit {

  public restaurants = [];
  public person: Person = {
    id : "",
    name : "",
    comment : ""
  };
  public selectedRestaurantPersons = [];
  public selectedRestaurant = null;
  private _userSubscription: Subscription;

  constructor(private onMangeOuService: OnmangeouService, public user: MsalAuthService, private errorHandler: ErrorHandlerService, private messageHandler: MessageHandlerService) {
  }


  getAllPersons(restaurant) {
    return this.onMangeOuService.getAllPersons(restaurant).subscribe((data) => {
      return data;
    })
  }


  private loadData() {

    // Create persons observer object
    const myRestaurantsObserver = {
      next: (x: Restaurant[]) => {
        this.restaurants = x;
        if (this.user.restaurantVotedId === "0")
          this.selectedRestaurant = this.restaurants[0];
        else
          this.selectedRestaurant = this.restaurants.find(p => p.id === this.user.restaurantVotedId);
        this.onMangeOuService.getAllPersons(this.selectedRestaurant).subscribe(myPersonsObserver);
      },
      error: err => this.errorHandler.handleError(err),
      complete: () => console.log('Restaurants Observer got a complete notification '),
    };

    // Create persons observer object
    const myPersonsObserver = {
      next: (x: Person[]) => this.selectedRestaurantPersons = x,
      error: err => console.error('Observer got an error: ' + err),
      complete: () => console.log('Persons Observer got a complete notification '),
    };

    this.onMangeOuService.getAllRestaurants().subscribe(myRestaurantsObserver);

  }

  ngOnInit() {
    this.loadData();
    this._userSubscription = this.user.userSubject.subscribe({
      next: (x: Person) => { this.loadData() },
      error: err => this.errorHandler.handleError(err),
      complete: () => console.log('user Observer got a complete notification '),
    }
    )

  }

  ngOnDestroy() {
    this._userSubscription.unsubscribe();
  }

  public vote() {
    this.user.vote(this.selectedRestaurant.id, this.person.comment);
    this.person.comment = "";
  }


  showPersons(restaurant) {
    this.selectedRestaurant = restaurant;
    this.selectedRestaurantPersons = restaurant.persons;
  }

}
