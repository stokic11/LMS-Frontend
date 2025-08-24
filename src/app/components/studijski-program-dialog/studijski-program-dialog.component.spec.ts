import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudijskiProgramDialogComponent } from './studijski-program-dialog.component';

describe('StudijskiProgramDialogComponent', () => {
  let component: StudijskiProgramDialogComponent;
  let fixture: ComponentFixture<StudijskiProgramDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudijskiProgramDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudijskiProgramDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
