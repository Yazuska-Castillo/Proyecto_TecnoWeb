import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  private storageKey = 'reservas';

  obtenerReservas() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  guardarReservas(reservas: any[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(reservas));
  }

  agregarReserva(reserva: any) {
    const todas = this.obtenerReservas();
    todas.push(reserva);
    this.guardarReservas(todas);
  }

  cancelarReserva(id: number) {
    const todas = this.obtenerReservas();
    const actualizadas = todas.map((r: any) =>
      r.id === id ? { ...r, estado: 'Cancelada' } : r
    );
    this.guardarReservas(actualizadas);
  }
}
