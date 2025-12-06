import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomsService } from 'src/app/services/room.service';
import { ReservasService } from 'src/app/services/reservas.service';
import { AuthService } from 'src/app/services/auth.service';
import { PromocionesService } from 'src/app/services/promociones.service';
import { Promo } from 'src/app/models/promo.model';

@Component({
  selector: 'app-reserva-cliente',
  templateUrl: './reserva-cliente.component.html',
  styleUrls: ['./reserva-cliente.component.css'],
})
export class ReservaClienteComponent implements OnInit {
  promoActiva: Promo | null = null;
  precioPorNocheConPromo!: number;

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
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.hotel = params['hotel'];
      this.habitacionId = +params['habitacion'];
      this.personas = +params['personas'];
    });

    // Cargar habitación seleccionada
    this.roomsService.getRooms().subscribe((rooms) => {
      this.habitacion = rooms.find((r) => r.id === this.habitacionId);
    });

    this.promoActiva = this.promosService.getMejorPromo();

    const base = this.habitacion.pricePorNoche ?? this.habitacion.pricePerNight;
    this.precioPorNocheConPromo =
      this.promosService.calcularPrecioConPromo(base);

    this.calcularTotal();
  }

  calcularTotal() {
    if (this.fechaEntrada && this.fechaSalida) {
      const entrada = new Date(this.fechaEntrada);
      const salida = new Date(this.fechaSalida);
      const diff = salida.getTime() - entrada.getTime();

      if (diff > 0) {
        const noches = diff / (1000 * 60 * 60 * 24);
        const precioBase =
          this.precioPorNocheConPromo ?? this.habitacion.pricePorNoche;
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

    const usuario = this.auth.getUsuarioActual();
    if (!usuario) {
      alert('Error: No hay usuario logueado.');
      return;
    }

    const entrada = new Date(this.fechaEntrada);
    const salida = new Date(this.fechaSalida);

    if (salida <= entrada) {
      alert('Las fechas seleccionadas no son válidas.');
      return;
    }

    // 1️⃣ OBTENER TODAS LAS RESERVAS
    const reservas = this.reservasService.obtenerReservas();

    // 2️⃣ RESERVAS DE ESTA HABITACIÓN
    const reservasDeHabitacion = reservas.filter(
      (r: any) => r.habitacionId === this.habitacion.id
    );

    // 3️⃣ VALIDAR SOLAPAMIENTO
    const conflicto = reservasDeHabitacion.some((r: any) => {
      const ini = new Date(r.fechaInicio);
      const fin = new Date(r.fechaFin);

      return entrada < fin && salida > ini;
    });

    if (conflicto) {
      alert('❌ La habitación NO está disponible para esas fechas.');
      return;
    }

    // 4️⃣ CREAR RESERVA
    const reserva = {
      id: Date.now(),
      habitacionId: this.habitacion.id,
      hotelId: this.habitacion.idHotel,
      hotelNombre: this.hotel,

      numeroHabitacion: this.habitacion.number,
      tipoHabitacion: this.habitacion.type,

      fechaInicio: this.fechaEntrada,
      fechaFin: this.fechaSalida,

      precio: this.precioPorNocheConPromo ?? this.habitacion.pricePerNight,
      estado: 'Confirmada',

      usuarioEmail: usuario.email,
      usuarioNombre: usuario.nombre,
    };

    // 5️⃣ GUARDAR RESERVA
    this.reservasService.agregarReserva(reserva);

    // 6️⃣ MARCAR HABITACIÓN COMO OCUPADA 🔥🔥🔥
    this.roomsService.actualizarEstadoHabitacion(this.habitacion.id, 'Ocupada');

    alert('✔ Reserva realizada con éxito');

    // 7️⃣ REDIRIGIR
    this.router.navigate(['/cliente/historial']);
  }
}
