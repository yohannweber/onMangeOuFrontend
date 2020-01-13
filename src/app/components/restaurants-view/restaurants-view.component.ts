import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-restaurants-view',
  templateUrl: './restaurants-view.component.html',
  styleUrls: ['./restaurants-view.component.scss']
})
export class RestaurantsViewComponent implements OnInit {

  @Input() public restaurant;
  @Input() public selectedRestaurant;

  constructor() { }

  ngOnInit() {
    console.log(this.restaurant);
  }

  isSelectedRestaurant(restaurant){
    return this.restaurant === this.selectedRestaurant
  }

}
