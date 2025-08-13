import { TestBed } from '@angular/core/testing';

import { FajlService } from './fajl.service';

describe('FajlService', () => {
  let service: FajlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FajlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
