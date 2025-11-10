import { Injectable } from '@angular/core';
import { Hotel } from '../models/hotel';
@Injectable({
  providedIn: 'root',
})
export class HotelesService {
  private key = 'hoteles';

  constructor() {
    if (!localStorage.getItem(this.key)) {
      const iniciales: Hotel[] = [
        {
          id: 1,
          nombre: 'Hilton Arica',
          ubicacion: 'Arica',
          categoria: 5,
          habitaciones: 80,
        },
        {
          id: 2,
          nombre: 'Costa Pacífico',
          ubicacion: 'Iquique',
          categoria: 4,
          habitaciones: 65,
        },
        {
          id: 3,
          nombre: 'Atacama Inn',
          ubicacion: 'Antofagasta',
          categoria: 3,
          habitaciones: 40,
        },
      ];
      localStorage.setItem(this.key, JSON.stringify(iniciales));
    }
  }

  obtenerHoteles(): Hotel[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  guardarHoteles(hoteles: Hotel[]): void {
    localStorage.setItem(this.key, JSON.stringify(hoteles));
  }

  agregarHotel(hotel: Hotel): void {
    const hoteles = this.obtenerHoteles();
    hotel.id =
      hoteles.length > 0 ? Math.max(...hoteles.map((h) => h.id)) + 1 : 1;
    hoteles.push(hotel);
    this.guardarHoteles(hoteles);
  }

  actualizarHotel(hotel: Hotel): void {
    const hoteles = this.obtenerHoteles().map((h) =>
      h.id === hotel.id ? hotel : h
    );
    this.guardarHoteles(hoteles);
  }

  eliminarHotel(id: number): void {
    const hoteles = this.obtenerHoteles().filter((h) => h.id !== id);
    this.guardarHoteles(hoteles);
  }
}
