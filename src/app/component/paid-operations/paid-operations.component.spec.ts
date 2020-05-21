import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidOperationsComponent } from './paid-operations.component';

describe('PaidOperationsComponent', () => {
  let component: PaidOperationsComponent;
  let fixture: ComponentFixture<PaidOperationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidOperationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
