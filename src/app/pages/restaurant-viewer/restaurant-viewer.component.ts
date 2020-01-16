import { Component, OnInit } from '@angular/core';
import { OnmangeouService, Person, Restaurant } from 'src/app/services/onmangeou.service';
import { MsalAuthService } from 'src/app/services/msal-auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-restaurant-viewer',
  templateUrl: './restaurant-viewer.component.html',
  styleUrls: ['./restaurant-viewer.component.scss']
})
export class RestaurantViewerComponent implements OnInit {

  public restaurants = [];
  public selectedRestaurantPersons = [];
  public selectedRestaurant = null; 

  constructor(private onMangeOuService: OnmangeouService, public auth : MsalAuthService, private errorHandler : ErrorHandlerService) {
   }

   
  getAllPersons(restaurant){
    return this.onMangeOuService.getAllPersons(restaurant).subscribe((data)=>{
      return data;
    })
  }

  ngOnInit() {

    // Create persons observer object
    const myRestaurantsObserver = {
      next: (x : Restaurant[]) => { this.restaurants = x 
                                    this.selectedRestaurant = this.restaurants[0];
                                    this.onMangeOuService.getAllPersons(this.selectedRestaurant).subscribe(myPersonsObserver);
                                  },
      //error: err => console.error('Observer got an error: ' + err),
      error: err => this.errorHandler.handleError(err),
      complete: () => console.log('Restaurants Observer got a complete notification '),
    };
    
  // Create persons observer object
  const myPersonsObserver = {
    next: (x : Person[]) => this.selectedRestaurantPersons = x,
    error: err => console.error('Observer got an error: ' + err),
    complete: () => console.log('Persons Observer got a complete notification '),
  };

  this.onMangeOuService.getAllRestaurants().subscribe(myRestaurantsObserver);
   /*this.onMangeOuService.getAllRestaurants().subscribe((data)=>{
    console.log(data);
    this.restaurants = data;
    this.selectedRestaurant = this.restaurants[0];
    /*this.onMangeOuService.getAllPersons(this.selectedRestaurant).subscribe((data)=>{
      this.selectedRestaurantPersons = data;})
    })
    
  });*/
}


  showPersons(restaurant){
      this.selectedRestaurant = restaurant;
      this.selectedRestaurantPersons = restaurant.persons;
  }

}
