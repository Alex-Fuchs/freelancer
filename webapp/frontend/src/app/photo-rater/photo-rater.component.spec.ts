import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoRaterComponent } from './photo-rater.component';

describe('PhotoRaterComponent', () => {
  let component: PhotoRaterComponent;
  let fixture: ComponentFixture<PhotoRaterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoRaterComponent]
    });
    fixture = TestBed.createComponent(PhotoRaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
