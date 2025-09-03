import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SifarnikComponent } from './sifarnik.component';

describe('SifarnikComponent', () => {
  let component: SifarnikComponent;
  let fixture: ComponentFixture<SifarnikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SifarnikComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SifarnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
