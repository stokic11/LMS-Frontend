import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizacijaNastaveComponent } from './organizacija-nastave.component';

describe('OrganizacijaNastaveComponent', () => {
  let component: OrganizacijaNastaveComponent;
  let fixture: ComponentFixture<OrganizacijaNastaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizacijaNastaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizacijaNastaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
