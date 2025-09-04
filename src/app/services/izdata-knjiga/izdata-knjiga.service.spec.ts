import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { IzdataKnjigaService } from './izdata-knjiga.service';

describe('IzdataKnjigaService', () => {
  let service: IzdataKnjigaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(IzdataKnjigaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
