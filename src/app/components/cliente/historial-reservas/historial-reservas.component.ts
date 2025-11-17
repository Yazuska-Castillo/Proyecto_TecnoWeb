import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ReservasService } from 'src/app/services/reservas.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-historial-reservas',
  templateUrl: './historial-reservas.component.html',
  styleUrls: ['./historial-reservas.component.css'],
})
export class HistorialReservasComponent implements OnInit {
  reservas: any[] = [];

  // Para Bootstrap Modal
  reservaEditando: any = null;
  nuevaEntrada: string = '';
  nuevaSalida: string = '';
  modalRef: any; // referencia al modal Bootstrap

  constructor(
    private auth: AuthService,
    private reservasService: ReservasService
  ) {}

  ngOnInit(): void {
    const usuario = this.auth.getUsuarioActual();
    if (!usuario) return;

    const todas = this.reservasService.obtenerReservas();
    this.reservas = todas.filter((r: any) => r.usuarioEmail === usuario.email);
  }

  // =====================================================
  // ✔ Abrir modal Bootstrap
  // =====================================================
  modificar(reserva: any) {
    console.log('Reserva seleccionada para editar:', reserva);

    this.reservaEditando = reserva;
    this.nuevaEntrada = reserva.fechaInicio;
    this.nuevaSalida = reserva.fechaFin;

    const modalElement = document.getElementById('modalEditarReserva');
    this.modalRef = new bootstrap.Modal(modalElement!);
    this.modalRef.show();
  }

  // =====================================================
  // ✔ Guardar cambios de fecha
  // =====================================================
  guardarCambio() {
    if (!this.nuevaEntrada || !this.nuevaSalida) {
      alert('Selecciona ambas fechas');
      return;
    }

    // Actualizar los datos
    this.reservaEditando.fechaInicio = this.nuevaEntrada;
    this.reservaEditando.fechaFin = this.nuevaSalida;

    // Guardar en storage
    const todas = this.reservasService.obtenerReservas();
    const nuevas = todas.map((r: any) =>
      r.usuarioEmail === this.reservaEditando.usuarioEmail &&
      r.habitacion === this.reservaEditando.habitacion
        ? this.reservaEditando
        : r
    );

    this.reservasService.guardarReservas(nuevas);
    alert('Fechas modificadas correctamente ✔');

    this.modalRef.hide(); // Cerrar modal

    // Actualizar vista
    const usuario = this.auth.getUsuarioActual();
    this.reservas = nuevas.filter((r: any) => r.usuarioEmail === usuario.email);
  }

  // =====================================================
  // ✔ Cancelar reserva
  // =====================================================
  cancelar(reserva: any) {
    if (!confirm('¿Seguro que deseas cancelar esta reserva?')) return;

    reserva.estado = 'Cancelada';

    const todas = this.reservasService.obtenerReservas();
    const nuevas = todas.map((r: any) =>
      r.usuarioEmail === reserva.usuarioEmail &&
      r.habitacion === reserva.habitacion
        ? reserva
        : r
    );

    this.reservasService.guardarReservas(nuevas);

    alert('Reserva cancelada correctamente ✔');

    const usuario = this.auth.getUsuarioActual();
    this.reservas = nuevas.filter((r: any) => r.usuarioEmail === usuario.email);
  }
}
