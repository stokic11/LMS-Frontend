import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakultetTableComponent } from './fakultet-table.component';

describe('FakultetTableComponent', () => {
  let component: FakultetTableComponent;
  let fixture: ComponentFixture<FakultetTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FakultetTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FakultetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
