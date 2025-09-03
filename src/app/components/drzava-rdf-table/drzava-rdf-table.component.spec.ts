import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrzavaRdfTableComponent } from './drzava-rdf-table.component';

describe('DrzavaRdfTableComponent', () => {
  let component: DrzavaRdfTableComponent;
  let fixture: ComponentFixture<DrzavaRdfTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrzavaRdfTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrzavaRdfTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
