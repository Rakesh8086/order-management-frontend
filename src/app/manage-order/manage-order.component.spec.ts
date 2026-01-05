import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrderComponent } from './manage-order.component';

describe('ManageOrderComponent', () => {
  let component: ManageOrderComponent;
  let fixture: ComponentFixture<ManageOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageOrderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
