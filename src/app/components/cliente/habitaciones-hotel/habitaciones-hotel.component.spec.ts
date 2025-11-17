import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitacionesHotelComponent } from './habitaciones-hotel.component';

describe('HabitacionesHotelComponent', () => {
  let component: HabitacionesHotelComponent;
  let fixture: ComponentFixture<HabitacionesHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HabitacionesHotelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitacionesHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
