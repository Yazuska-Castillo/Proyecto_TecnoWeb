import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HABITACIONES } from '../../../../data/habitaciones';


@Component({
  selector: 'app-detalle-habitacion',
  templateUrl: './detalle-habitacion.component.html',
  styleUrls: ['./detalle-habitacion.component.css']
})
export class DetalleHabitacionComponent implements OnInit {
  habitacion: any;
  fechaInicio!: string;
  fechaFin!: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.habitacion = HABITACIONES.find(h => h.id === id);
  }

  reservar() {
    const nuevaReserva = {
      habitacion: this.habitacion.nombre,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      precio: this.habitacion.precioPorNoche,
      estado: 'Confirmada'
    };

    const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    reservas.push(nuevaReserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));

    alert('Reserva realizada con éxito');
    this.router.navigate(['/mis-reservas']);
  }
}
