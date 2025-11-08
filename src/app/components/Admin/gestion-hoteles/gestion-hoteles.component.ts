import { Component, Host } from '@angular/core';
import { HotObservable } from 'rxjs/internal/testing/HotObservable';
import { Hotel } from 'src/app/models/hotel';

@Component({
  selector: 'app-gestion-hoteles',
  templateUrl: './gestion-hoteles.component.html',
  styleUrls: ['./gestion-hoteles.component.css'],
})
export class GestionHotelesComponent {
  public nombre: string = '';
  public ubicacion: string = '';
  public categoria: number = 1;
  public habitaciones: number = 1;

  hoteles: Hotel[] = [
    new Hotel('Hilton Arica', 'Arica', 5, 120),
    new Hotel('Hotel Antay', 'Copiapó', 4, 80),
    new Hotel('Ibis Budget', 'Santiago', 3, 60),
  ];

  public agregarHotel(): void {
    let hotel: Hotel = new Hotel(
      this.nombre,
      this.ubicacion,
      this.categoria,
      this.habitaciones
    );
    this.hoteles.push(hotel);
  }
}
