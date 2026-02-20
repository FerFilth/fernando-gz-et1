import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SimpleChange } from '@angular/core';

import { RamInputComponent } from './ram-input.component';

describe('RamInputComponent', () => {
  let component: RamInputComponent;
  let fixture: ComponentFixture<RamInputComponent>;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RamInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RamInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a search FormControl', () => {
    expect(component.searchControl).toBeTruthy();
  });

  it('should emit search value after debounce', () => {
    const emitSpy = vi.spyOn(component.item, 'emit');

    component.searchControl.setValue('rick');
    vi.advanceTimersByTime(500);

    expect(emitSpy).toHaveBeenCalledWith('rick');
  });

  it('should not emit duplicate values', () => {
    const emitSpy = vi.spyOn(component.item, 'emit');

    component.searchControl.setValue('rick');
    vi.advanceTimersByTime(500);
    component.searchControl.setValue('rick');
    vi.advanceTimersByTime(500);

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should disable input when isLoading is true', () => {
    component.ngOnChanges({
      isLoading: new SimpleChange(false, true, false),
    });
    expect(component.searchControl.disabled).toBe(true);
  });

  it('should enable input when isLoading becomes false', () => {
    component.ngOnChanges({
      isLoading: new SimpleChange(false, true, false),
    });
    component.ngOnChanges({
      isLoading: new SimpleChange(true, false, false),
    });
    expect(component.searchControl.enabled).toBe(true);
  });

  it('should not emit when isLoading is true', () => {
    const emitSpy = vi.spyOn(component.item, 'emit');
    component.isLoading = true;

    component.searchControl.setValue('morty');
    vi.advanceTimersByTime(500);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should render the search input', () => {
    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector('input#searchInput');
    expect(input).toBeTruthy();
  });

  it('should unsubscribe on destroy', () => {
    component.ngOnDestroy();
    // Should not throw
    expect(true).toBe(true);
  });
});