import { TestBed } from '@angular/core/testing';

import { PorukaService } from './poruka.service';

describe('PorukaService', () => {
  let service: PorukaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PorukaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
