import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObavestenjeTableComponent } from './obavestenje-table.component';

describe('ObavestenjeTableComponent', () => {
  let component: ObavestenjeTableComponent;
  let fixture: ComponentFixture<ObavestenjeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObavestenjeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObavestenjeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
