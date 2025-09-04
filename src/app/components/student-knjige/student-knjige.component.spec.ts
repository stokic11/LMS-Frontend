import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { StudentKnjigeComponent } from './student-knjige.component';

describe('StudentKnjigeComponent', () => {
  let component: StudentKnjigeComponent;
  let fixture: ComponentFixture<StudentKnjigeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StudentKnjigeComponent,
        HttpClientTestingModule,
        MatSnackBarModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentKnjigeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
