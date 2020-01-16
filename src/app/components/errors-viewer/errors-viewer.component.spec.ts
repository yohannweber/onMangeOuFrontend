import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorsViewerComponent } from './errors-viewer.component';

describe('ErrorsViewerComponent', () => {
  let component: ErrorsViewerComponent;
  let fixture: ComponentFixture<ErrorsViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorsViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
