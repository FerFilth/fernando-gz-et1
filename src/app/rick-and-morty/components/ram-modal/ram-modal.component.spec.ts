import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RamModalComponent } from './ram-modal.component';

describe('RamModalComponent', () => {
  let component: RamModalComponent;
  let fixture: ComponentFixture<RamModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RamModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RamModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
