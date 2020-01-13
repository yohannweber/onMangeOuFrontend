import { Component, OnInit } from '@angular/core';
import { OnmangeouService } from 'src/app/services/onmangeou.service';

@Component({
  selector: 'app-restaurant-viewer',
  templateUrl: './restaurant-viewer.component.html',
  styleUrls: ['./restaurant-viewer.component.scss']
})
export class RestaurantViewerComponent implements OnInit {

  public restaurants = [];
  public selectedRestaurantPersons = [];
  public selectedRestaurant = null;

  constructor(private onMangeOuService: OnmangeouService) {
    console.log("constructeur comp");
   }

   
  getAllPersons(restaurant){
    return this.onMangeOuService.getAllPersons(restaurant).subscribe((data)=>{
      return data;
    })
  }

  ngOnInit() {
    this.onMangeOuService.getAllRestaurants().subscribe((data)=>{
    console.log(data);
    this.restaurants = data;
    this.selectedRestaurant = this.restaurants[0];
    this.onMangeOuService.getAllPersons(this.selectedRestaurant).subscribe((data)=>{
      console.log(data);
      this.selectedRestaurantPersons = data;
      console.log(this.selectedRestaurantPersons);})
    })
  }


  showPersons(restaurant){
    this.onMangeOuService.getAllPersons(restaurant).subscribe((data)=>{
      console.log(data);
      this.selectedRestaurant = restaurant;
      this.selectedRestaurantPersons = data;
      console.log(this.selectedRestaurantPersons);})
  }

}
