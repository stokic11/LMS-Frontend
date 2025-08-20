import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KorisnikTableComponent } from './korisnik-table.component';

describe('KorisnikTableComponent', () => {
  let component: KorisnikTableComponent;
  let fixture: ComponentFixture<KorisnikTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KorisnikTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KorisnikTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
