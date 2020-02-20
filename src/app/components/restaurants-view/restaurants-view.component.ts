import { Component, OnInit, Input } from '@angular/core';
import { MsalAuthService } from 'src/app/services/msal-auth.service';

@Component({
  selector: 'app-restaurants-view',
  templateUrl: './restaurants-view.component.html',
  styleUrls: ['./restaurants-view.component.scss']
})
export class RestaurantsViewComponent implements OnInit {

  @Input() public restaurant;
  @Input() public selectedRestaurant;

  constructor(public user : MsalAuthService) { }

  ngOnInit() {
    console.log(this.restaurant);
  }

  isSelectedRestaurant(){
    return this.restaurant === this.selectedRestaurant
  }

}
