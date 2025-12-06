import { Injectable } from '@angular/core';
import { RoomsService } from './room.service';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  private storageKey = 'reservas';

  constructor(private roomsService: RoomsService) {}

  obtenerReservas() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  getReservas() {
    return this.obtenerReservas();
  }

  guardarReservas(reservas: any[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(reservas));
  }

  agregarReserva(reserva: any) {
    const todas = this.obtenerReservas();
    todas.push(reserva);
    this.guardarReservas(todas);

    // 🔥 BLOQUEAR HABITACIÓN AUTOMÁTICAMENTE
    this.roomsService.actualizarEstadoHabitacion(reserva.habitacionId, 'Ocupada');
  }
}
