import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPotvrdaDialogComponent } from './student-potvrda-dialog.component';

describe('StudentPotvrdaDialogComponent', () => {
  let component: StudentPotvrdaDialogComponent;
  let fixture: ComponentFixture<StudentPotvrdaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentPotvrdaDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentPotvrdaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
