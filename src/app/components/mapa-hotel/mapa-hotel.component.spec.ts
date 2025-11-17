import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaHotelComponent } from './mapa-hotel.component';

describe('MapaHotelComponent', () => {
  let component: MapaHotelComponent;
  let fixture: ComponentFixture<MapaHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaHotelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
