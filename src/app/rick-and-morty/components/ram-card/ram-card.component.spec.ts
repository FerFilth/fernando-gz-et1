import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RamCardComponent } from './ram-card.component';

describe('RamCardComponent', () => {
  let component: RamCardComponent;
  let fixture: ComponentFixture<RamCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RamCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RamCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
