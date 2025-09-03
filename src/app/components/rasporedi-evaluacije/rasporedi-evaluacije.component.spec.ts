import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RasporeidiEvaluacijeComponent } from './rasporedi-evaluacije.component';

describe('RasporeidiEvaluacijeComponent', () => {
  let component: RasporeidiEvaluacijeComponent;
  let fixture: ComponentFixture<RasporeidiEvaluacijeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RasporeidiEvaluacijeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RasporeidiEvaluacijeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
