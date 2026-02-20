import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RamService } from './ram.service';
import { RamCharacter, RamResponse, Gender, Species, Status } from '../models/ram.interface';

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

const mockResponse: RamResponse = {
  info: { count: 826, pages: 42, next: 'page=2', prev: null },
  results: [mockCharacter],
};

describe('RamService', () => {
  let service: RamService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(RamService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCharacters', () => {
    it('should fetch characters from the API', () => {
      service.getCharacters(1, '').subscribe((response) => {
        expect(response).toBeTruthy();
        expect(response!.results.length).toBe(1);
        expect(response!.results[0].name).toBe('Rick Sanchez');
      });

      const req = httpMock.expectOne(
        'https://rickandmortyapi.com/api/character?page=1&name='
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return null on error', () => {
      service.getCharacters(1, 'nonexistent').subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(
        'https://rickandmortyapi.com/api/character?page=1&name=nonexistent'
      );
      req.flush('Error', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getCharactersByIds', () => {
    it('should fetch characters by IDs', () => {
      service.getCharactersByIds([1, 2]).subscribe((characters) => {
        expect(characters.length).toBe(1);
      });

      const req = httpMock.expectOne(
        'https://rickandmortyapi.com/api/character/1,2'
      );
      expect(req.request.method).toBe('GET');
      req.flush([mockCharacter]);
    });

    it('should return empty array for empty IDs', () => {
      service.getCharactersByIds([]).subscribe((characters) => {
        expect(characters).toEqual([]);
      });
      // No HTTP request should be made
    });
  });

  describe('setPage', () => {
    it('should update the page subject', () => {
      let currentPage = 0;
      service.page$.subscribe((p) => (currentPage = p));

      service.setPage(3);
      expect(currentPage).toBe(3);
    });
  });

  describe('setSearch', () => {
    it('should update the search subject and reset page to 1', () => {
      let currentSearch = '';
      let currentPage = 0;
      service.search$.subscribe((s) => (currentSearch = s));
      service.page$.subscribe((p) => (currentPage = p));

      service.setPage(5);
      service.setSearch('morty');

      expect(currentSearch).toBe('morty');
      expect(currentPage).toBe(1);
    });
  });

  describe('favorites', () => {
    it('should toggle a favorite on', () => {
      service.toggleFavorite(1);
      expect(service.isFavorite(1)).toBe(true);
    });

    it('should toggle a favorite off', () => {
      service.toggleFavorite(1);
      service.toggleFavorite(1);
      expect(service.isFavorite(1)).toBe(false);
    });

    it('should return the list of favorites', () => {
      service.toggleFavorite(1);
      service.toggleFavorite(2);
      const favorites = service.getFavorites();
      expect(favorites).toContain(1);
      expect(favorites).toContain(2);
    });

    it('should persist favorites to localStorage', () => {
      service.toggleFavorite(5);
      const stored = localStorage.getItem('ram-favorites');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toContain(5);
    });
  });

  describe('setFavoriteMode', () => {
    it('should update favoriteMode and reset page', () => {
      let mode = false;
      let page = 0;
      service.favoriteMode$.subscribe((m) => (mode = m));
      service.page$.subscribe((p) => (page = p));

      service.setPage(3);
      service.setFavoriteMode(true);

      expect(mode).toBe(true);
      expect(page).toBe(1);
    });
  });
});
