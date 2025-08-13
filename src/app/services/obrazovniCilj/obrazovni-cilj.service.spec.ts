import { TestBed } from '@angular/core/testing';

import { ObrazovniCiljService } from './obrazovni-cilj.service';

describe('ObrazovniCiljService', () => {
  let service: ObrazovniCiljService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObrazovniCiljService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
