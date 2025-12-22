import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { RoomsService } from 'src/app/services/room.service';
import { ReservasService } from 'src/app/services/reservas.service';
import { AuthService } from 'src/app/services/auth.service';
import { PromocionesService } from 'src/app/services/promociones.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Promo } from 'src/app/models/promo.model';
import { DateRange } from '@angular/material/datepicker';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-reserva-cliente',
  templateUrl: './reserva-cliente.component.html',
  styleUrls: ['./reserva-cliente.component.css'],
})
export class ReservaClienteComponent implements OnInit {
  rangoSeleccionado: DateRange<Date> | null = new DateRange<Date>(null, null);

  promoActiva: Promo | null = null;
  precioPorNocheConPromo!: number;

  promosDisponibles: Promo[] = [];
  promoSeleccionada: Promo | null = null;

  reservasHabitacion: any[] = [];

  hotel!: string;
  habitacionId!: number;
  personas!: number;

  habitacion: any;

  fechaEntrada!: string;
  fechaSalida!: string;

  total = 0;

  constructor(
    private route: ActivatedRoute,
    private roomsService: RoomsService,
    private reservasService: ReservasService,
    private promosService: PromocionesService,
    private router: Router,
    private auth: AuthService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        if (this.habitacion) {
          this.cargarReservasHabitacion();
        }
      });

    this.route.queryParams.subscribe((params) => {
      this.hotel = params['hotel'];
      this.habitacionId = +params['habitacion'];
      this.personas = +params['personas'];
    });

        this.roomsService.getRooms().subscribe((rooms) => {
      this.habitacion = rooms.find((r) => r.id === this.habitacionId);
      if (!this.habitacion) return;

      this.promoActiva = this.promosService.getMejorPromo();

      this.cargarReservasHabitacion();
      this.syncFechasYTotal();
    });
  }


  actualizarPromosYPrecio() {
  if (!this.habitacion) return;

  const base =
    this.habitacion.pricePorNoche ?? this.habitacion.pricePerNight;

  const fechaRef = this.rangoSeleccionado?.start ?? new Date();
  this.promosDisponibles = this.promosService.getPromosActivas(fechaRef);

  if (
  this.promoSeleccionada && !this.promosDisponibles.some(p => p.id === this.promoSeleccionada!.id)) {
  this.promoSeleccionada = null;
  }

  let precioFinal = base;

  if (this.promoSeleccionada) {
    if (this.promoSeleccionada.tipo === 'porcentaje') {
      const desc = base * (this.promoSeleccionada.valor / 100);
      precioFinal = Math.max(0, Math.round(base - desc));
    } else {
      precioFinal = Math.max(0, base - this.promoSeleccionada.valor);
    }
  }

  this.precioPorNocheConPromo = precioFinal;
  this.calcularTotal();
}


  cargarReservasHabitacion() {
    this.reservasHabitacion = this.reservasService
      .obtenerReservas()
      .filter(
        (r: any) =>
          r.habitacionId === this.habitacion.id && r.estado === 'Confirmada'
      );
  }

  fechaDisponible = (fecha: Date | null): boolean => {
    if (!fecha) return false;

    const dia = this.normalizar(fecha);

    return !this.reservasHabitacion.some((r: any) => {
      const inicio = this.normalizar(new Date(r.fechaInicio + 'T12:00:00'));
      const fin = this.normalizar(new Date(r.fechaFin + 'T12:00:00'));

      return dia >= inicio && dia < fin;
    });
  };

  dateClass = (date: Date) => {
    const dia = this.normalizar(date);

    const ocupada = this.reservasHabitacion.some((r: any) => {
      const inicio = this.normalizar(new Date(r.fechaInicio + 'T12:00:00'));
      const fin = this.normalizar(new Date(r.fechaFin + 'T12:00:00'));

      return dia >= inicio && dia < fin;
    });

    return ocupada ? 'ocupado' : '';
  };

  onEntradaChange(fecha: Date | null) {
    if (!fecha) return;

    const entrada = this.normalizar(fecha);

    this.rangoSeleccionado = new DateRange<Date>(
      entrada,
      this.rangoSeleccionado?.end ?? null
    );

    this.syncFechasYTotal();
  }

  onSalidaChange(fecha: Date | null) {
    if (!fecha) return;

    const salida = this.normalizar(fecha);

    this.rangoSeleccionado = new DateRange<Date>(
      this.rangoSeleccionado?.start ?? null,
      salida
    );

    this.syncFechasYTotal();
  }

  private syncFechasYTotal() {
    const start = this.rangoSeleccionado?.start;
    const end = this.rangoSeleccionado?.end;

    if (start) this.fechaEntrada = this.toLocalDate(start);
    if (end) this.fechaSalida = this.toLocalDate(end);

    this.actualizarPromosYPrecio();
  }

  calcularTotal() {
    const start = this.rangoSeleccionado?.start;
    const end = this.rangoSeleccionado?.end;

    if (!start || !end) {
      this.total = 0;
      return;
    }

    const ini = this.normalizar(start);
    const fin = this.normalizar(end);

    const diff = fin.getTime() - ini.getTime();
    if (diff <= 0) {
      this.total = 0;
      return;
    }

    const noches = diff / (1000 * 60 * 60 * 24);
    const precio =
      this.precioPorNocheConPromo ??
      this.habitacion.pricePorNoche ??
      this.habitacion.pricePerNight;

    this.total = noches * precio;
  }

  reservar() {
    if (!this.rangoSeleccionado?.start || !this.rangoSeleccionado?.end) {
      alert('Debes seleccionar las fechas.');
      return;
    }

    const email = this.auth.getEmailDesdeToken();
    if (!email) return;

    const usuario = this.usuariosService.buscarUsuarioPorEmail(email);
    if (!usuario) return;

    const reserva = {
      id: Date.now(),
      habitacionId: this.habitacion.id,
      hotelId: this.habitacion.idHotel,
      hotelNombre: this.hotel,
      numeroHabitacion: this.habitacion.number,
      tipoHabitacion: this.habitacion.type,
      fechaInicio: this.toLocalDate(this.rangoSeleccionado.start),
      fechaFin: this.toLocalDate(this.rangoSeleccionado.end),
      precio:
        this.precioPorNocheConPromo ??
        this.habitacion.pricePorNoche ??
        this.habitacion.pricePerNight,
      estado: 'Confirmada',
      usuarioEmail: usuario.email,
      usuarioNombre: usuario.nombre,
    };

    this.reservasService.agregarReserva(reserva);
    this.cargarReservasHabitacion();
    alert('✔ Reserva realizada con éxito');
    this.router.navigate(['/cliente/historial']);
  }
  
    seleccionarPromo(promoId: string | null) {
    if (!promoId) {
      this.promoSeleccionada = null;
    } else {
      this.promoSeleccionada =
        this.promosDisponibles.find((p: Promo) => p.id === +promoId) || null;
    }

    this.actualizarPromosYPrecio();
  }

    private normalizar(d: Date): Date {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x;
  }

  private toLocalDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

}

