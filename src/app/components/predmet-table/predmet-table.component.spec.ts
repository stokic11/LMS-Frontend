import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredmetTableComponent } from './predmet-table.component';

describe('PredmetTableComponent', () => {
  let component: PredmetTableComponent;
  let fixture: ComponentFixture<PredmetTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PredmetTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredmetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
