import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredmetDetailsComponent } from './predmet-details.component';

describe('PredmetDetailsComponent', () => {
  let component: PredmetDetailsComponent;
  let fixture: ComponentFixture<PredmetDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PredmetDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredmetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
