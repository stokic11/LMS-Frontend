import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudijskiProgramTableComponent } from './studijski-program-table.component';

describe('StudijskiProgramTableComponent', () => {
  let component: StudijskiProgramTableComponent;
  let fixture: ComponentFixture<StudijskiProgramTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudijskiProgramTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudijskiProgramTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
