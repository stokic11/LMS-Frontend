import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrijavaIspitaComponent } from './prijava-ispita.component';

describe('PrijavaIspitaComponent', () => {
  let component: PrijavaIspitaComponent;
  let fixture: ComponentFixture<PrijavaIspitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrijavaIspitaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrijavaIspitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
