import { TestBed } from '@angular/core/testing';

import { IshodService } from './ishod.service';

describe('IshodService', () => {
  let service: IshodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IshodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
