import { TestBed } from '@angular/core/testing';

import { UlogaService } from './uloga.service';

describe('UlogaService', () => {
  let service: UlogaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UlogaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
