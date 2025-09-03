import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NastavnikOcenjivanjeDialogComponent } from './nastavnik-ocenjivanje-dialog.component';

describe('NastavnikOcenjivanjeDialogComponent', () => {
  let component: NastavnikOcenjivanjeDialogComponent;
  let fixture: ComponentFixture<NastavnikOcenjivanjeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NastavnikOcenjivanjeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NastavnikOcenjivanjeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
