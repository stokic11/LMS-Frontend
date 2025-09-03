import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPotvrdaComponent } from './student-potvrde.component';

describe('StudentPotvrdaComponent', () => {
  let component: StudentPotvrdaComponent;
  let fixture: ComponentFixture<StudentPotvrdaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentPotvrdaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentPotvrdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
