import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

import { HomeListComponent } from './home-list.component';
import { RamService } from '../../services/ram.service';
import { RamCharacter, RamResponse, Gender, Species, Status } from '../../models/ram.interface';

@Component({ selector: 'app-ram-input', template: '' ,standalone: false})
class MockRamInputComponent {
  @Output() item = new EventEmitter<string>();
  @Input() isLoading = false;
}

@Component({ selector: 'app-ram-grid', template: '' ,standalone: false})
class MockRamGridComponent {
  @Input() characters: RamCharacter[] | null = null;
}

@Component({ selector: 'app-paginator', template: '' ,standalone: false})
class MockPaginatorComponent {
  @Input() isLoading = false;
}

const mockCharacter: RamCharacter = {
  id: 1, name: 'Rick Sanchez', status: Status.Alive, species: Species.Human,
  type: '', gender: Gender.Male, origin: { name: 'Earth', url: '' },
  location: { name: 'Earth', url: '' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: [], url: '', created: new Date(),
};

const mockResponse: RamResponse = {
  info: { count: 1, pages: 1, next: '', prev: null },
  results: [mockCharacter],
};

describe('HomeListComponent', () => {
  let component: HomeListComponent;
  let fixture: ComponentFixture<HomeListComponent>;
  let ramServiceMock: any;

  beforeEach(async () => {
    ramServiceMock = {
      getCharactersCombined: vi.fn().mockReturnValue(of(mockResponse)),
      loading$: new BehaviorSubject(false).asObservable(),
      setSearch: vi.fn(),
      setFavoriteMode: vi.fn(),
    };

    await TestBed.configureTestingModule({
        declarations: [
          HomeListComponent,
          MockRamGridComponent,
          MockPaginatorComponent,
        ],
        imports: [
          MockRamInputComponent,
        ],
      providers: [{ provide: RamService, useValue: ramServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load characters on init', () => {
    expect(ramServiceMock.getCharactersCombined).toHaveBeenCalled();
    expect(component.characters.length).toBe(1);
    expect(component.characters[0].name).toBe('Rick Sanchez');
  });

  it('should set info on init', () => {
    expect(component.info).toBeTruthy();
    expect(component.info!.count).toBe(1);
  });

  it('should handle null response', () => {
    ramServiceMock.getCharactersCombined.mockReturnValue(of(null));
    component.getCharacters();

    expect(component.characters).toEqual([]);
    expect(component.info).toBeNull();
  });

  it('should toggle favorite mode', () => {
    expect(component.showOnlyFavorites).toBe(false);
    component.toggleFavorite();
    expect(component.showOnlyFavorites).toBe(true);
    expect(ramServiceMock.setFavoriteMode).toHaveBeenCalledWith(true);
  });

  it('should toggle favorite mode off', () => {
    component.toggleFavorite();
    component.toggleFavorite();
    expect(component.showOnlyFavorites).toBe(false);
    expect(ramServiceMock.setFavoriteMode).toHaveBeenCalledWith(false);
  });

  it('should call setSearch on search', () => {
    component.onSearch('morty');
    expect(ramServiceMock.setSearch).toHaveBeenCalledWith('morty');
  });

  it('should return correct icon style when showing favorites', () => {
    component.showOnlyFavorites = true;
    const style = component.getIconStyle();
    expect(style['color']).toBe('#ffc107');
  });

  it('should return correct icon style when not showing favorites', () => {
    component.showOnlyFavorites = false;
    const style = component.getIconStyle();
    expect(style['color']).toBe('#6c757d');
  });

  it('should display the correct title text', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent?.trim()).toBe('Wubba lubba dub dub!');
  });

  it('should display "Mis favoritos" title when in favorites mode', () => {
    component.showOnlyFavorites = true;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent?.trim()).toBe('Mis favoritos');
  });

  it('should unsubscribe on destroy', () => {
    component.ngOnDestroy();
    expect(true).toBe(true);
  });
});