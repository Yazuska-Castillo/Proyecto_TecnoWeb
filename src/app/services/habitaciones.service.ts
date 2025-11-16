import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HabitacionesService {
  private key = 'habitaciones';

  constructor() {
    // Si no existen aún, las inicializamos
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify([]));
    }
  }

  obtenerHabitacionesPorHotel(hotelId: number) {
    const data = localStorage.getItem(this.key);
    const habitaciones = data ? JSON.parse(data) : [];
    return habitaciones.filter((h: any) => h.hotelId === hotelId);
  }

  obtenerHabitacion(id: number) {
    const data = localStorage.getItem(this.key);
    const habitaciones = data ? JSON.parse(data) : [];
    return habitaciones.find((h: any) => h.id === id);
  }

  agregarHabitacion(habitacion: any) {
    const data = localStorage.getItem(this.key);
    const habitaciones = data ? JSON.parse(data) : [];

    habitacion.id =
      habitaciones.length > 0
        ? Math.max(...habitaciones.map((h: any) => h.id)) + 1
        : 1;

    habitaciones.push(habitacion);
    localStorage.setItem(this.key, JSON.stringify(habitaciones));
  }
}
