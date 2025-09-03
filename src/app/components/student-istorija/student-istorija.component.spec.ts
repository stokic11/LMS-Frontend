import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentIstorijaComponent } from './student-istorija.component';

describe('StudentIstorijaComponent', () => {
  let component: StudentIstorijaComponent;
  let fixture: ComponentFixture<StudentIstorijaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentIstorijaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentIstorijaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
