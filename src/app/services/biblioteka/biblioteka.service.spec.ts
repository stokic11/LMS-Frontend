import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BibliotekaService } from './biblioteka.service';

describe('BibliotekaService', () => {
  let service: BibliotekaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(BibliotekaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
