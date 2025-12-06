import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomsService } from 'src/app/services/room.service';
import { HotelesService } from 'src/app/services/hoteles.service';
import { PromocionesService } from 'src/app/services/promociones.service';
import { Promo } from 'src/app/models/promo.model';
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
  promoActiva: Promo | null = null;

  // ❗ NUEVO: Fechas seleccionadas
  fechaEntrada: string = "";
  fechaSalida: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomsService: RoomsService,
    private hotelesService: HotelesService,
    private promocionesService: PromocionesService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.hotelId = +params['hotelId'];
      this.cargarDatos();
    });
    this.promoActiva = this.promocionesService.getMejorPromo();
  }

  // ⭐ TOTALMENTE NUEVO: Solo muestra habitaciones sin reservas solapadas
  cargarDatos() {
    this.hotel = this.hotelesService
      .obtenerHoteles()
      .find((h) => h.id === this.hotelId);

    this.roomsService.getRooms().subscribe((rooms) => {
      const habs = rooms.filter((r) => r.hotel === this.hotel.nombre);

      // Si no hay fechas → mostrar todo
      if (!this.fechaEntrada || !this.fechaSalida) {
        this.habitaciones = habs;
        return;
      }

      const entrada = new Date(this.fechaEntrada);
      const salida = new Date(this.fechaSalida);

      const reservas = JSON.parse(localStorage.getItem("reservas") || "[]");

      this.habitaciones = habs.filter((hab) => {
        // Reservas asociadas a esta habitación
        const reservasHab = reservas.filter((r: any) => r.idHabitacion === hab.id);

        const conflicto = reservasHab.some((r: any) => {
          const ini = new Date(r.fechaInicio);
          const fin = new Date(r.fechaFin);
          return entrada < fin && salida > ini;
        });

        return !conflicto;
      });
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

  calcularPrecioConPromo(hab: any): number {
    return this.promocionesService.calcularPrecioConPromo(hab.pricePerNight);
  }

}
