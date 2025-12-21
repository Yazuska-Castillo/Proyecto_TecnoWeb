import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomsService } from 'src/app/services/room.service';
import { ReservasService } from 'src/app/services/reservas.service';
import { AuthService } from 'src/app/services/auth.service';
import { PromocionesService } from 'src/app/services/promociones.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Promo } from 'src/app/models/promo.model';

@Component({
  selector: 'app-reserva-cliente',
  templateUrl: './reserva-cliente.component.html',
  styleUrls: ['./reserva-cliente.component.css'],
})
export class ReservaClienteComponent implements OnInit {
  promoActiva: Promo | null = null;
  precioPorNocheConPromo!: number;

  promosDisponibles: Promo[] = [];
  promoSeleccionada: Promo | null = null;


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
    this.route.queryParams.subscribe((params) => {
      this.hotel = params['hotel'];
      this.habitacionId = +params['habitacion'];
      this.personas = +params['personas'];
    });

    this.promoActiva = this.promosService.getMejorPromo();
    this.actualizarPromosYPrecio();

  }

  actualizarPromosYPrecio() {
  if (!this.habitacion) return;

  const base =
    this.habitacion.pricePorNoche ?? this.habitacion.pricePerNight;

  this.promosDisponibles = this.promosService.getPromosActivas(new Date());

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


  calcularTotal() {
    if (this.fechaEntrada && this.fechaSalida && this.habitacion) {
      const entrada = new Date(this.fechaEntrada);
      const salida = new Date(this.fechaSalida);
      const diff = salida.getTime() - entrada.getTime();

      if (diff > 0) {
        const noches = diff / (1000 * 60 * 60 * 24);
        const precioBase =
          this.precioPorNocheConPromo ??
          this.habitacion.pricePorNoche ??
          this.habitacion.pricePerNight;

        this.total = noches * precioBase;
      } else {
        this.total = 0;
      }
    }
  }

  reservar() {
    if (!this.fechaEntrada || !this.fechaSalida) {
      alert('Debes seleccionar las fechas.');
      return;
    }

    const email = this.auth.getEmailDesdeToken();
    if (!email) {
      alert('Error: No hay usuario logueado.');
      return;
    }

    const usuario = this.usuariosService.buscarUsuarioPorEmail(email);
    if (!usuario) {
      alert('Error: Usuario no encontrado.');
      return;
    }

    const entrada = new Date(this.fechaEntrada);
    const salida = new Date(this.fechaSalida);

    if (salida <= entrada) {
      alert('Las fechas seleccionadas no son válidas.');
      return;
    }

    const reservas = this.reservasService.obtenerReservas();

    const reservasDeHabitacion = reservas.filter(
      (r: any) => r.habitacionId === this.habitacion.id
    );

    const conflicto = reservasDeHabitacion.some((r: any) => {
      const ini = new Date(r.fechaInicio);
      const fin = new Date(r.fechaFin);
      return entrada < fin && salida > ini;
    });

    if (conflicto) {
      alert('❌ La habitación NO está disponible para esas fechas.');
      return;
    }

    const reserva = {
      id: Date.now(),
      habitacionId: this.habitacion.id,
      hotelId: this.habitacion.idHotel,
      hotelNombre: this.hotel,

      numeroHabitacion: this.habitacion.number,
      tipoHabitacion: this.habitacion.type,

      fechaInicio: this.fechaEntrada,
      fechaFin: this.fechaSalida,

      precio:
        this.precioPorNocheConPromo ??
        this.habitacion.pricePorNoche ??
        this.habitacion.pricePerNight,

      estado: 'Confirmada',

      usuarioEmail: usuario.email,
      usuarioNombre: usuario.nombre,
    };

    this.reservasService.agregarReserva(reserva);
    this.roomsService.actualizarEstadoHabitacion(this.habitacion.id, 'Ocupada');

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



}

