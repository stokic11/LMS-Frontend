import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SilabusEditDialogComponent } from './silabus-edit-dialog.component';

describe('SilabusEditDialogComponent', () => {
  let component: SilabusEditDialogComponent;
  let fixture: ComponentFixture<SilabusEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SilabusEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SilabusEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
