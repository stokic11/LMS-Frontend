import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminiRasporedComponent } from './termini-raspored.component';

describe('TerminiRasporedComponent', () => {
  let component: TerminiRasporedComponent;
  let fixture: ComponentFixture<TerminiRasporedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminiRasporedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminiRasporedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
