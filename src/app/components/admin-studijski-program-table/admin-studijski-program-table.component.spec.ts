import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStudijskiProgramTableComponent } from './admin-studijski-program-table.component';

describe('AdminStudijskiProgramTableComponent', () => {
  let component: AdminStudijskiProgramTableComponent;
  let fixture: ComponentFixture<AdminStudijskiProgramTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminStudijskiProgramTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminStudijskiProgramTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
