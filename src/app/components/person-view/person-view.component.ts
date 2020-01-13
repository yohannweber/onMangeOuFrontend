import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-person-view',
  templateUrl: './person-view.component.html',
  styleUrls: ['./person-view.component.scss']
})
export class PersonViewComponent implements OnInit {

  @Input() public persons; 

  constructor() { }

  ngOnInit() {
    console.log(this.persons);
  }

}
