import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentiEvaluacijeComponent } from './instrumenti-evaluacije.component';

describe('InstrumentiEvaluacijeComponent', () => {
  let component: InstrumentiEvaluacijeComponent;
  let fixture: ComponentFixture<InstrumentiEvaluacijeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstrumentiEvaluacijeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstrumentiEvaluacijeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
