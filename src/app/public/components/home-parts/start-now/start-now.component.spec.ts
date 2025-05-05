import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartNowComponent } from './start-now.component';

describe('StartNowComponent', () => {
  let component: StartNowComponent;
  let fixture: ComponentFixture<StartNowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StartNowComponent]
    });
    fixture = TestBed.createComponent(StartNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
