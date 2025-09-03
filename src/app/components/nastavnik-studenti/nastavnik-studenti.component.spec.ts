import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NastavnikStudentiComponent } from './nastavnik-studenti.component';

describe('NastavnikStudentiComponent', () => {
  let component: NastavnikStudentiComponent;
  let fixture: ComponentFixture<NastavnikStudentiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NastavnikStudentiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NastavnikStudentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
