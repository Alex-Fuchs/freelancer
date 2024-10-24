import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BioCreatorComponent } from './bio-creator.component';

describe('BioCreatorComponent', () => {
  let component: BioCreatorComponent;
  let fixture: ComponentFixture<BioCreatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BioCreatorComponent]
    });
    fixture = TestBed.createComponent(BioCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
