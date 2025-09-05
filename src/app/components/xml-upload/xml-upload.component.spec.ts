import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XmlUploadComponent } from './xml-upload.component';

describe('XmlUploadComponent', () => {
  let component: XmlUploadComponent;
  let fixture: ComponentFixture<XmlUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XmlUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XmlUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
