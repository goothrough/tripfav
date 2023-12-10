import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareTripModalComponent } from './share-trip-modal.component';

describe('ShareTripModalComponent', () => {
  let component: ShareTripModalComponent;
  let fixture: ComponentFixture<ShareTripModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShareTripModalComponent]
    });
    fixture = TestBed.createComponent(ShareTripModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
