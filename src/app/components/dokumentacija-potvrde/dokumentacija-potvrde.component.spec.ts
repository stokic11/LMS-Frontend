import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DokumentacijaPotvrdaComponent } from './dokumentacija-potvrde.component';

describe('DokumentacijaPotvrdaComponent', () => {
  let component: DokumentacijaPotvrdaComponent;
  let fixture: ComponentFixture<DokumentacijaPotvrdaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DokumentacijaPotvrdaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DokumentacijaPotvrdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
