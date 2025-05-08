import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstHomePartComponent } from './first-home-part.component';

describe('FirstHomePartComponent', () => {
  let component: FirstHomePartComponent;
  let fixture: ComponentFixture<FirstHomePartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FirstHomePartComponent]
    });
    fixture = TestBed.createComponent(FirstHomePartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
