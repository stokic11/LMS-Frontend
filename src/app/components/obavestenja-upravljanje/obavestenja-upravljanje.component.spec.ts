import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObavestenjaUpravljanjeComponent } from './obavestenja-upravljanje.component';

describe('ObavestenjaUpravljanjeComponent', () => {
  let component: ObavestenjaUpravljanjeComponent;
  let fixture: ComponentFixture<ObavestenjaUpravljanjeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObavestenjaUpravljanjeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObavestenjaUpravljanjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
