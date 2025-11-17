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
  styleUrls: ['./reserva-cliente.component.css']
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
    this.route.queryParams.subscribe(params => {
      this.hotel = params['hotel'];
      this.habitacionId = +params['habitacion'];
      this.personas = +params['personas'];
    });

    // Cargar la habitación correcta
    this.roomsService.getRooms().subscribe(rooms => {
      this.habitacion = rooms.find(r => r.id === this.habitacionId);
    });

    this.promoActiva = this.promosService.getMejorPromo();

    const base = this.habitacion.pricePerNight;
    this.precioPorNocheConPromo = this.promosService.calcularPrecioConPromo(base);

    this.calcularTotal();

  }

  calcularTotal() {
    if (this.fechaEntrada && this.fechaSalida) {
      const entrada = new Date(this.fechaEntrada);
      const salida = new Date(this.fechaSalida);
      const diff = salida.getTime() - entrada.getTime();

      if (diff > 0) {
        const noches = diff / (1000 * 60 * 60 * 24);
        const precioBase = this.precioPorNocheConPromo ?? this.habitacion.pricePerNight;
        this.total = noches * precioBase;
      } else {
        this.total = 0;
      }
    }
  }

  reservar() {
    if (!this.fechaEntrada || !this.fechaSalida) {
      alert("Debes seleccionar las fechas.");
      return;
    }

    const usuario = this.auth.getUsuarioActual();

    if (!usuario) {
      alert("Error: No hay usuario logueado.");
      return;
    }

    // -------------------------------
    // RESERVA CORRECTA
    // -------------------------------
    const reserva = {
      habitacion: `Habitación ${this.habitacion.number} - ${this.habitacion.type}`,
      hotel: this.habitacion.hotel,
      fechaInicio: this.fechaEntrada,
      fechaFin: this.fechaSalida,
      precio: this.precioPorNocheConPromo ?? this.habitacion.pricePerNight,
      estado: "Confirmada",
      usuarioEmail: usuario.email,
      usuarioNombre: usuario.nombre
    };

    this.reservasService.agregarReserva(reserva);
    alert("Reserva realizada con éxito ✔");

    // Redirigir al historial
    this.router.navigate(['/cliente/historial']);
  }
}
