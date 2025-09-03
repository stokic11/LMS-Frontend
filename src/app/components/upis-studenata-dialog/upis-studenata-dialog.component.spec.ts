import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpisStudenataDialogComponent } from './upis-studenata-dialog.component';

describe('UpisStudenataDialogComponent', () => {
  let component: UpisStudenataDialogComponent;
  let fixture: ComponentFixture<UpisStudenataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpisStudenataDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpisStudenataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
