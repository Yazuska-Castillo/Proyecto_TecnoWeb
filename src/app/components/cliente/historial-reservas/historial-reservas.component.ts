// historial-reservas.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-historial-reservas',
  templateUrl: './historial-reservas.component.html',
  styleUrls: ['./historial-reservas.component.css']
})
export class HistorialReservasComponent {
  reservas: any[] = [];

  ngOnInit() {
    this.reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
  }

  modificar(reserva: any) {
    const nuevaFecha = prompt('Nueva fecha de fin:', reserva.fechaFin);
    if (nuevaFecha) {
      reserva.fechaFin = nuevaFecha;
      localStorage.setItem('reservas', JSON.stringify(this.reservas));
      alert('✅ Fecha modificada con éxito');
    }
  }

  cancelar(reserva: any) {
    reserva.estado = 'Cancelada (Reembolso en proceso)';
    localStorage.setItem('reservas', JSON.stringify(this.reservas));
    alert('💸 Reserva cancelada, reembolso en proceso.');
  }
}
