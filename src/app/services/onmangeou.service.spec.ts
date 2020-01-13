import { TestBed } from '@angular/core/testing';

import { OnmangeouService } from './onmangeou.service';

describe('OnmangeouService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OnmangeouService = TestBed.get(OnmangeouService);
    expect(service).toBeTruthy();
  });
});
