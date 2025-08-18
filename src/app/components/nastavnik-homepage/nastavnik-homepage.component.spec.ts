import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NastavnikHomepageComponent } from './nastavnik-homepage.component';

describe('NastavnikHomepageComponent', () => {
  let component: NastavnikHomepageComponent;
  let fixture: ComponentFixture<NastavnikHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NastavnikHomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NastavnikHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
