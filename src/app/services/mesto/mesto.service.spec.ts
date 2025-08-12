import { TestBed } from '@angular/core/testing';

import { MestoService } from './mesto.service';

describe('MestoService', () => {
  let service: MestoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MestoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
