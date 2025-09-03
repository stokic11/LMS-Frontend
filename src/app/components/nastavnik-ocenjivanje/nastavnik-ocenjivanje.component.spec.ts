import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NastavnikOcenjivanjeComponent } from './nastavnik-ocenjivanje.component';

describe('NastavnikOcenjivanjeComponent', () => {
  let component: NastavnikOcenjivanjeComponent;
  let fixture: ComponentFixture<NastavnikOcenjivanjeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NastavnikOcenjivanjeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NastavnikOcenjivanjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
