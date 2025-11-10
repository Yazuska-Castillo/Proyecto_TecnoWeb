import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HABITACIONES } from '../../../../data/habitaciones';

@Component({
  selector: 'app-catalogo-habitaciones',
  templateUrl: './catalogo-habitaciones.component.html',
  styleUrls: ['./catalogo-habitaciones.component.css'],
})
export class CatalogoHabitacionesComponent {
  habitaciones = HABITACIONES;
  habitacionesFiltradas = HABITACIONES;
  busqueda = '';

  constructor(private router: Router) {}

  verDetalle(habitacion: any) {
    this.router.navigate(['/habitacion', habitacion.id]);
  }

  ordenar(tipo: string) {
    if (tipo === 'asc')
      this.habitacionesFiltradas.sort(
        (a, b) => a.precioPorNoche - b.precioPorNoche
      );
    else
      this.habitacionesFiltradas.sort(
        (a, b) => b.precioPorNoche - a.precioPorNoche
      );
  }
}
