import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantsViewComponent } from './restaurants-view.component';

describe('RestaurantsViewComponent', () => {
  let component: RestaurantsViewComponent;
  let fixture: ComponentFixture<RestaurantsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
