import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceEnhancerComponent } from './face-enhancer.component';

describe('FaceEnhancerComponent', () => {
  let component: FaceEnhancerComponent;
  let fixture: ComponentFixture<FaceEnhancerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaceEnhancerComponent]
    });
    fixture = TestBed.createComponent(FaceEnhancerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
