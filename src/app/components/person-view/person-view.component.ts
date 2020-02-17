import { Component, OnInit, Input } from '@angular/core';
import { Person } from 'src/app/services/onmangeou.service';

@Component({
  selector: 'app-person-view',
  templateUrl: './person-view.component.html',
  styleUrls: ['./person-view.component.scss']
})
export class PersonViewComponent implements OnInit {

  @Input() public persons : Person[] ; 

  constructor() { }

  ngOnInit() {
  }

}
