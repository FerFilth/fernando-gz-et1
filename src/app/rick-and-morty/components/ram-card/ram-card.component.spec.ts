import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RamCardComponent } from './ram-card.component';
import { RamService } from '../../services/ram.service';
import { RamCharacter, Gender, Species, Status } from '../../models/ram.interface';
import { beforeEach, describe, expect, it, vi } from 'vitest';
const mockCharacter: RamCharacter = {
  id: 1,
  name: 'Rick Sanchez',
  status: Status.Alive,
  species: Species.Human,
  type: '',
  gender: Gender.Male,
  origin: { name: 'Earth', url: '' },
  location: { name: 'Earth', url: '' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: ['https://rickandmortyapi.com/api/episode/1'],
  url: 'https://rickandmortyapi.com/api/character/1',
  created: new Date('2017-11-04T18:48:46.250Z'),
};

describe('RamCardComponent', () => {
  let component: RamCardComponent;
  let fixture: ComponentFixture<RamCardComponent>;
  let ramServiceMock: any;
  let modalServiceMock: any;

  beforeEach(async () => {
    ramServiceMock = {
      isFavorite: vi.fn().mockReturnValue(false),
      toggleFavorite: vi.fn(),
    };

    modalServiceMock = {
      open: vi.fn().mockReturnValue({
        componentInstance: {},
      }),
    };

    await TestBed.configureTestingModule({
      imports: [NgbModule],
      declarations: [RamCardComponent],
      providers: [
        { provide: RamService, useValue: ramServiceMock },
        { provide: NgbModal, useValue: modalServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RamCardComponent);
    component = fixture.componentInstance;
    component.character = mockCharacter;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check isFavorite on init', () => {
    expect(ramServiceMock.isFavorite).toHaveBeenCalledWith(1);
    expect(component.isFavorite).toBe(false);
  });

  it('should return character image', () => {
    expect(component.getImage()).toBe(mockCharacter.image);
  });

  it('should set hasLoaded to true on onLoad', () => {
    expect(component.hasLoaded).toBe(false);
    component.onLoad();
    expect(component.hasLoaded).toBe(true);
  });

  it('should toggle favorite', () => {
    component.toggleFavorite();
    expect(ramServiceMock.toggleFavorite).toHaveBeenCalledWith(1);
    expect(component.isFavorite).toBe(true);
  });

  it('should open modal with character', () => {
    component.openModal();
    expect(modalServiceMock.open).toHaveBeenCalled();
  });

  it('should not toggle favorite when character is null', () => {
    component.character = null;
    component.toggleFavorite();
    expect(ramServiceMock.toggleFavorite).not.toHaveBeenCalledTimes(2);
  });

  it('should return correct icon style when not favorite', () => {
    component.isFavorite = false;
    const style = component.getIconStyle();
    expect(style['color']).toBe('#6c757d');
  });

  it('should return correct icon style when is favorite', () => {
    component.isFavorite = true;
    const style = component.getIconStyle();
    expect(style['color']).toBe('#ffc107');
  });

  it('should display character name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h5')?.textContent).toContain('Rick Sanchez');
  });
});