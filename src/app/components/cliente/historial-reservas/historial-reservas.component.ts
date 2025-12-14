import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ReservasService } from 'src/app/services/reservas.service';
import { RoomsService } from 'src/app/services/room.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-historial-reservas',
  templateUrl: './historial-reservas.component.html',
  styleUrls: ['./historial-reservas.component.css'],
})
export class HistorialReservasComponent implements OnInit {
  reservas: any[] = [];

  reservaEditando: any = null;
  nuevaEntrada: string = '';
  nuevaSalida: string = '';
  modalRef: any;

  constructor(
    private auth: AuthService,
    private reservasService: ReservasService,
    private roomsService: RoomsService
  ) {}

  ngOnInit(): void {
    const email = this.auth.getEmailDesdeToken();
    if (!email) return;

    const todas = this.reservasService.obtenerReservas();
    this.reservas = todas.filter((r: any) => r.usuarioEmail === email);
  }

  // =====================================================
  // ✔ Abrir modal
  // =====================================================
  modificar(reserva: any) {
    this.reservaEditando = reserva;
    this.nuevaEntrada = reserva.fechaInicio;
    this.nuevaSalida = reserva.fechaFin;

    const modalElement = document.getElementById('modalEditarReserva');
    this.modalRef = new bootstrap.Modal(modalElement!);
    this.modalRef.show();
  }

  // =====================================================
  // ✔ Guardar cambio de fechas
  // =====================================================
  guardarCambio() {
    if (!this.nuevaEntrada || !this.nuevaSalida) {
      alert('Selecciona ambas fechas');
      return;
    }

    this.reservaEditando.fechaInicio = this.nuevaEntrada;
    this.reservaEditando.fechaFin = this.nuevaSalida;

    const todas = this.reservasService.obtenerReservas();
    const nuevas = todas.map((r: any) =>
      r.id === this.reservaEditando.id ? this.reservaEditando : r
    );

    this.reservasService.guardarReservas(nuevas);

    alert('Fechas modificadas correctamente ✔');
    this.modalRef.hide();

    const email = this.auth.getEmailDesdeToken();
    this.reservas = nuevas.filter((r: any) => r.usuarioEmail === email);
  }

  // =====================================================
  // ✔ Cancelar reserva (libera habitación)
  // =====================================================
  cancelar(reserva: any) {
    if (!confirm('¿Seguro que deseas cancelar esta reserva?')) return;

    reserva.estado = 'Cancelada';

    // Liberar habitación
    this.roomsService.actualizarEstadoHabitacion(
      reserva.habitacionId,
      'Disponible'
    );

    const todas = this.reservasService.obtenerReservas();
    const nuevas = todas.map((r: any) => (r.id === reserva.id ? reserva : r));

    this.reservasService.guardarReservas(nuevas);

    alert('Reserva cancelada ✔');

    const email = this.auth.getEmailDesdeToken();
    this.reservas = nuevas.filter((r: any) => r.usuarioEmail === email);
  }
}
