import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObavestenjeDialogComponent } from './obavestenje-dialog.component';

describe('ObavestenjeDialogComponent', () => {
  let component: ObavestenjeDialogComponent;
  let fixture: ComponentFixture<ObavestenjeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObavestenjeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObavestenjeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
