import { TestBed } from '@angular/core/testing';

import { InstrumentEvaluacijeService } from './instrument-evaluacije.service';

describe('InstrumentEvaluacijeService', () => {
  let service: InstrumentEvaluacijeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstrumentEvaluacijeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
