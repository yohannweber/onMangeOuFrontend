import { Component, OnInit, ErrorHandler } from '@angular/core';
import { OnmangeouService, Restaurant, Person } from 'src/app/services/onmangeou.service';
import { Router } from '@angular/router';
import { MsalAuthService } from 'src/app/services/msal-auth.service';

@Component({
  selector: 'app-create-restaurant',
  templateUrl: './create-restaurant.component.html',
  styleUrls: ['./create-restaurant.component.scss']
})
export class CreateRestaurantComponent implements OnInit {

  public newRestaurant : Restaurant = {
    id: "",
    name: "",
    type: "",
    descr: "",
    persons: []
  };
  public newPerson : Person = {
    id : "",
    name : "",
    comment : ""
  };
  

  constructor(private onMangeOuService: OnmangeouService, private router : Router, private _user : MsalAuthService, private _errorHandler : ErrorHandler) { }

  ngOnInit() {
  }

  
  createRestaurant() {
    let restaurant : Restaurant = {
      id : "",
      name: this.newRestaurant.name,
      type: this.newRestaurant.type,
      descr: this.newRestaurant.descr,
      persons: []
    };
    console.log(restaurant);
    this.onMangeOuService
    .addRestaurant(restaurant)
    .subscribe( (data : Restaurant) =>{
    this._user.vote(data.id, this.newPerson.comment)
    this.router.navigate(['']);
    },
    (err) => this._errorHandler.handleError(err)
    )
    
  }

}
