import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SizingBoardComponent } from './sizing-board.component';
import { provideRouter } from '@angular/router';

describe('SizingBoardComponent', () => {
  let component: SizingBoardComponent;
  let fixture: ComponentFixture<SizingBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SizingBoardComponent],
      providers: [provideRouter([])]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SizingBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});