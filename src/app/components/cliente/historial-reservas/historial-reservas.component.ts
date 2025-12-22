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
  // 🔹 Listas separadas
  reservasConfirmadas: any[] = [];
  reservasCanceladas: any[] = [];

  mostrarCanceladas = false;

  // 🔹 Modal edición
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
    this.cargarReservasUsuario();
  }

  // =====================================================
  // 🔄 Cargar y separar reservas del usuario
  // =====================================================
  cargarReservasUsuario() {
    const email = this.auth.getEmailDesdeToken();
    if (!email) return;

    const todas = this.reservasService
      .obtenerReservas()
      .filter((r: any) => r.usuarioEmail === email);

    this.reservasConfirmadas = todas.filter(
      (r: any) => r.estado === 'Confirmada'
    );

    this.reservasCanceladas = todas.filter(
      (r: any) => r.estado === 'Cancelada'
    );
  }

  // =====================================================
  // ✔ Abrir modal editar fechas
  // =====================================================
  modificar(reserva: any) {
    this.reservaEditando = { ...reserva }; // copia segura
    this.nuevaEntrada = reserva.fechaInicio;
    this.nuevaSalida = reserva.fechaFin;

    const modalElement = document.getElementById('modalEditarReserva');
    this.modalRef = new bootstrap.Modal(modalElement!);
    this.modalRef.show();
  }

  // =====================================================
  // ✔ Guardar cambios de fechas
  // =====================================================
  guardarCambio() {
    if (!this.nuevaEntrada || !this.nuevaSalida) {
      alert('Selecciona ambas fechas');
      return;
    }

    const todas = this.reservasService.obtenerReservas();

    const actualizadas = todas.map((r: any) =>
      r.id === this.reservaEditando.id
        ? {
            ...r,
            fechaInicio: this.nuevaEntrada,
            fechaFin: this.nuevaSalida,
          }
        : r
    );

    this.reservasService.guardarReservas(actualizadas);

    this.modalRef.hide();
    alert('Fechas modificadas correctamente ✔');

    this.cargarReservasUsuario(); // 🔄 refresca listas
  }

  // =====================================================
  // ✔ Cancelar reserva (libera fechas)
  // =====================================================
  cancelar(reserva: any) {
    if (!confirm('¿Seguro que deseas cancelar esta reserva?')) return;

    const todas = this.reservasService.obtenerReservas();

    const actualizadas = todas.map((r: any) =>
      r.id === reserva.id ? { ...r, estado: 'Cancelada' } : r
    );

    this.reservasService.guardarReservas(actualizadas);

    // 🔓 liberar habitación (estado general)
    this.roomsService.actualizarEstadoHabitacion(
      reserva.habitacionId,
      'Disponible'
    );

    alert('Reserva cancelada ✔');

    this.cargarReservasUsuario(); // 🔄 refresca listas
  }
}
