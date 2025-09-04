import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentskaStudentiComponent } from './studentska-studenti.component';

describe('StudentskaStudentiComponent', () => {
  let component: StudentskaStudentiComponent;
  let fixture: ComponentFixture<StudentskaStudentiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentskaStudentiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentskaStudentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
