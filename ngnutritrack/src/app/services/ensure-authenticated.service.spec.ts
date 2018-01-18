import { TestBed, inject } from '@angular/core/testing';

import { EnsureAuthenticated } from './ensure-authenticated.service';

describe('EnsureAuthenticated', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnsureAuthenticated]
    });
  });

  it('should be created', inject([EnsureAuthenticated], (service: EnsureAuthenticated) => {
    expect(service).toBeTruthy();
  }));
});
