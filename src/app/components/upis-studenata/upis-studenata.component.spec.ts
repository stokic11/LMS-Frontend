import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpisStudenataComponent } from './upis-studenata.component';

describe('UpisStudenataComponent', () => {
  let component: UpisStudenataComponent;
  let fixture: ComponentFixture<UpisStudenataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpisStudenataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpisStudenataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
