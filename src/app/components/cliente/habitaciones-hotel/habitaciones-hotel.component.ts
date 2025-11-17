import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomsService } from 'src/app/services/room.service';
import { HotelesService } from 'src/app/services/hoteles.service';
import { AuthService } from 'src/app/services/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-habitaciones-hotel',
  templateUrl: './habitaciones-hotel.component.html',
  styleUrls: ['./habitaciones-hotel.component.css'],
})
export class HabitacionesHotelComponent implements OnInit {
  hotelId!: number;
  hotel: any;
  habitaciones: any[] = [];
  personas = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomsService: RoomsService,
    private hotelesService: HotelesService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.hotelId = +params['hotelId'];
      this.cargarDatos();
    });
  }

  cargarDatos() {
    this.hotel = this.hotelesService
      .obtenerHoteles()
      .find((h) => h.id === this.hotelId);

    this.roomsService.getRooms().subscribe((rooms) => {
      this.habitaciones = rooms.filter(
        (r) => r.hotel === this.hotel.nombre && r.status === 'Disponible'
      );
    });
  }

  reservar(hab: any) {
    // Si NO está logueado → abrir modal
    if (!this.auth.estaLogueado()) {
      const modalEl = document.getElementById('modalLoginNecesario')!;
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
      return;
    }

    // Si SÍ está logueado → continuar la reserva
    this.seleccionarHabitacion(hab);
  }

  seleccionarHabitacion(hab: any) {
    this.router.navigate(['/cliente/reserva'], {
      queryParams: {
        hotel: this.hotel.nombre,
        habitacion: hab.id,
        personas: this.personas,
      },
    });
  }
}
