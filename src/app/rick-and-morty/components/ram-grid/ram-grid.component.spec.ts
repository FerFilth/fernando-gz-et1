import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RamGridComponent } from './ram-grid.component';

describe('RamGridComponent', () => {
  let component: RamGridComponent;
  let fixture: ComponentFixture<RamGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RamGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RamGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
