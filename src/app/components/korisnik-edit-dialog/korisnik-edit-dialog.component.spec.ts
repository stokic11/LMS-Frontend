import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KorisnikEditDialogComponent } from './korisnik-edit-dialog.component';

describe('KorisnikEditDialogComponent', () => {
  let component: KorisnikEditDialogComponent;
  let fixture: ComponentFixture<KorisnikEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KorisnikEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KorisnikEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
