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
  fechaEntrada: string = '';
  fechaSalida: string = '';

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

  // Solo muestra habitaciones sin reservas solapadas
  cargarDatos() {
    this.hotel = this.hotelesService
      .obtenerHoteles()
      .find((h) => h.id === this.hotelId);

    if (!this.hotel) return;

    const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');

    this.roomsService.getRooms().subscribe((rooms) => {
      let habs = rooms
        .filter((r) => r.hotel === this.hotel.nombre)
        .map((r) => ({
          ...r,
          images: this.roomsService.cargarTodasImagenes(r.id),
        }));

      habs = habs.filter((r) => r.capacity >= this.personas);

      if (this.fechaEntrada && this.fechaSalida) {
        const entrada = this.normalizarFecha(this.fechaEntrada);
        const salida = this.normalizarFecha(this.fechaSalida);

        habs = habs.filter((hab) => {
          const reservasHab = reservas.filter(
            (r: any) => r.habitacionId === hab.id && r.estado !== 'Cancelada'
          );
          const hayCruce = reservasHab.some((r: any) => {
            const ini = this.normalizarFecha(r.fechaInicio);
            const fin = this.normalizarFecha(r.fechaFin);
            return entrada < fin && salida >= ini;
          });

          return !hayCruce;
        });
      }

      this.habitaciones = habs;
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
  private normalizarFecha(fecha: string | Date): Date {
    const d = new Date(fecha);
    d.setHours(12, 0, 0, 0);
    return d;
  }

  calcularPrecioConPromo(hab: any): number {
    return this.promocionesService.calcularPrecioConPromo(hab.pricePerNight);
  }
}
