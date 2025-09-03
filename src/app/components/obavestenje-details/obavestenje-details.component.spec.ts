import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObavestenjeDetailsComponent } from './obavestenje-details.component';

describe('ObavestenjeDetailsComponent', () => {
  let component: ObavestenjeDetailsComponent;
  let fixture: ComponentFixture<ObavestenjeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObavestenjeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObavestenjeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
