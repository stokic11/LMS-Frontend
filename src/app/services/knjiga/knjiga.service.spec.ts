import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { KnjigaService } from './knjiga.service';

describe('KnjigaService', () => {
  let service: KnjigaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(KnjigaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
