import { TestBed } from '@angular/core/testing';

import { PohadjanjePredmetaService } from './pohadjanje-predmeta.service';

describe('PohadjanjePredmetaService', () => {
  let service: PohadjanjePredmetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PohadjanjePredmetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
