import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';

import { RamGridComponent } from './ram-grid.component';
import { RamCharacter, Gender, Species, Status } from '../../models/ram.interface';
import { beforeEach, describe, expect, it, vi } from 'vitest';
@Component({ selector: 'app-ram-card', template: '<div class="mock-card">{{character?.name}}</div>' })
class MockRamCardComponent {
  @Input() character: RamCharacter | null = null;
}

const mockCharacters: RamCharacter[] = [
  {
    id: 1, name: 'Rick Sanchez', status: Status.Alive, species: Species.Human,
    type: '', gender: Gender.Male, origin: { name: 'Earth', url: '' },
    location: { name: 'Earth', url: '' },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: [], url: '', created: new Date(),
  },
  {
    id: 2, name: 'Morty Smith', status: Status.Alive, species: Species.Human,
    type: '', gender: Gender.Male, origin: { name: 'Earth', url: '' },
    location: { name: 'Earth', url: '' },
    image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
    episode: [], url: '', created: new Date(),
  },
];

describe('RamGridComponent', () => {
  let component: RamGridComponent;
  let fixture: ComponentFixture<RamGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RamGridComponent, MockRamCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RamGridComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have null characters by default', () => {
    expect(component.characters).toBeNull();
  });

  it('should render cards when characters are provided', () => {
    component.characters = mockCharacters;
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('app-ram-card');
    expect(cards.length).toBe(2);
  });

  it('should show fallback message when characters list is empty', () => {
    component.characters = [];
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No hay personajes disponibles');
  });

  it('should show fallback message when characters is null', () => {
    component.characters = null;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No hay personajes disponibles');
  });
});
