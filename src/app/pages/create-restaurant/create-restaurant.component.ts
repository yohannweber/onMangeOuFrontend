import { Component, OnInit } from '@angular/core';
import { OnmangeouService, Restaurant, Person } from 'src/app/services/onmangeou.service';
import { Router } from '@angular/router';

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
  

  constructor(private onMangeOuService: OnmangeouService, private router : Router) { }

  ngOnInit() {
  }

  
  createRestaurant() {
    let restaurant : Restaurant = {
      id : "",
      name: this.newRestaurant.name,
      type: this.newRestaurant.type,
      descr: this.newRestaurant.descr,
      persons: [
        this.newPerson
      ]
    };
    console.log(restaurant);
    this.onMangeOuService
    .addRestaurant(restaurant)
    .subscribe( (data) =>{
    this.router.navigate(['']);
    }
    )
    
  }

}
