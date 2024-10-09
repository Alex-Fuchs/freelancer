import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSuggestorComponent } from './message-suggestor.component';

describe('MessageSuggestorComponent', () => {
  let component: MessageSuggestorComponent;
  let fixture: ComponentFixture<MessageSuggestorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessageSuggestorComponent]
    });
    fixture = TestBed.createComponent(MessageSuggestorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
