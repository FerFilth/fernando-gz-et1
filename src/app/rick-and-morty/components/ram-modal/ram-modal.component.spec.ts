import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RamModalComponent } from './ram-modal.component';
import { RamCharacter, Gender, Species, Status } from '../../models/ram.interface';

const mockCharacter: RamCharacter = {
  id: 1,
  name: 'Rick Sanchez',
  status: Status.Alive,
  species: Species.Human,
  type: '',
  gender: Gender.Male,
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: ['https://rickandmortyapi.com/api/episode/1'],
  url: 'https://rickandmortyapi.com/api/character/1',
  created: new Date('2017-11-04T18:48:46.250Z'),
};

describe('RamModalComponent', () => {
  let component: RamModalComponent;
  let fixture: ComponentFixture<RamModalComponent>;
  let activeModalMock: any;

  beforeEach(async () => {
    activeModalMock = {
      dismiss: vi.fn(),
      close: vi.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [RamModalComponent],
      providers: [{ provide: NgbActiveModal, useValue: activeModalMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(RamModalComponent);
    component = fixture.componentInstance;
    component.character = mockCharacter;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display character name', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Rick Sanchez');
  });

  it('should display character status', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Alive');
  });

  it('should display character gender', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Male');
  });

  it('should display character species', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Human');
  });

  it('should display character origin', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Earth (C-137)');
  });

  it('should display character location', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Citadel of Ricks');
  });

  it('should display character image', () => {
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.src).toContain('avatar/1.jpeg');
  });

  it('should dismiss modal when close button is clicked', () => {
    const closeBtn = fixture.nativeElement.querySelector('.close') as HTMLElement;
    closeBtn.click();
    expect(activeModalMock.dismiss).toHaveBeenCalled();
  });

  it('should have activeModal injected', () => {
    expect(component.activeModal).toBeTruthy();
  });
});