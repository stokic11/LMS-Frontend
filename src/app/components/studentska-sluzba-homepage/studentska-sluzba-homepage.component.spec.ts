import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentskaSluzbaHomepageComponent } from './studentska-sluzba-homepage.component';

describe('StudentskaSluzbaHomepageComponent', () => {
  let component: StudentskaSluzbaHomepageComponent;
  let fixture: ComponentFixture<StudentskaSluzbaHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentskaSluzbaHomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentskaSluzbaHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
