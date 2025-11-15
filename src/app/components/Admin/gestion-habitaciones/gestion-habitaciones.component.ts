import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Room } from 'src/app/models/room.model';
import { RoomsService } from 'src/app/services/room.service';
import { HotelesService } from 'src/app/services/hoteles.service';
import { Hotel } from 'src/app/models/hotel';

@Component({
  selector: 'app-gestion-habitaciones',
  templateUrl: './gestion-habitaciones.component.html',
  styleUrls: ['./gestion-habitaciones.component.css']
})
export class GestionHabitacionesComponent implements OnInit {
  @ViewChild('modalAgregar') modalAgregar: any;
  @ViewChild('modalEditar') modalEditar: any;

  rooms: Room[] = [];
  hotelActual: Hotel | null = null;
  hotelId: number | null = null;

  isAdding: boolean = false;
  habitacionesCreadas: number = 0;
  limiteHabitaciones: number = 0;
  habilitarAgregar: boolean = true;

  nuevaHabitacion: Room = {
    id: 0,
    number: '',
    type: '',
    hotel: '',
    pricePerNight: 0,
    capacity: 0,
    status: 'Disponible'
  };

  habitacionEditando: Room = {
    id: 0,
    number: '',
    type: '',
    hotel: '',
    pricePerNight: 0,
    capacity: 0,
    status: 'Disponible'
  };

  constructor(
    private roomsService: RoomsService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private hotelesService: HotelesService
  ) { }

  ngOnInit(): void {
    // Una sola suscripción a las habitaciones
    this.roomsService.getRooms().subscribe(habitaciones => {
      this.procesarHabitaciones(habitaciones);
    });

    // Obtener hotelId de la URL
    this.route.queryParams.subscribe(params => {
      this.hotelId = params['hotelId'] ? +params['hotelId'] : null;
      if (this.hotelId) {
        this.cargarHotelActual();
      }
    });
  }

  private procesarHabitaciones(todasLasHabitaciones: Room[]): void {
    if (this.hotelActual) {
      // Filtrar SOLO habitaciones del hotel actual
      this.rooms = todasLasHabitaciones.filter(room => 
        room.hotel === this.hotelActual!.nombre
      );
    } else {
      this.rooms = todasLasHabitaciones;
    }
    this.actualizarContador();
  }

  private cargarHotelActual(): void {
    const hoteles = this.hotelesService.obtenerHoteles();
    this.hotelActual = hoteles.find(h => h.id === this.hotelId) || null;
    
    if (this.hotelActual) {
      this.nuevaHabitacion.hotel = this.hotelActual.nombre;
      this.limiteHabitaciones = this.hotelActual.habitaciones;
      
      // Reprocesar habitaciones con el nuevo filtro
      this.roomsService.getRooms().subscribe(habitaciones => {
        this.procesarHabitaciones(habitaciones);
      });
    }
  }

  private actualizarContador(): void {
    if (this.hotelActual) {
      this.habitacionesCreadas = this.rooms.length;
      this.habilitarAgregar = this.habitacionesCreadas < this.limiteHabitaciones;
    } else {
      this.habilitarAgregar = true;
    }
  }

  get mensajeHabitacionesRestantes(): string {
    if (!this.hotelActual) return 'Sin límite';
    
    const restantes = this.limiteHabitaciones - this.habitacionesCreadas;
    
    if (restantes === 0) {
      return '❌ Límite alcanzado';
    } else if (restantes === 1) {
      return '1 habitación restante';
    } else {
      return `${restantes} habitaciones restantes`;
    }
  }

  // === MÉTODOS PRINCIPALES ===
  abrirModalAgregar(): void {
    this.modalService.open(this.modalAgregar, { size: 'lg' });
  }

  agregarHabitacion(): void {
    if (this.isAdding) return;

    if (!this.nuevaHabitacion.number || !this.nuevaHabitacion.type || !this.habilitarAgregar) {
      return;
    }

    this.isAdding = true;

    // Calcular ID sin suscripción anidada (EVITA BUCLE)
    const maxId = this.rooms.length > 0 ? 
      Math.max(...this.rooms.map(r => r.id)) : 0;
    
    this.nuevaHabitacion.id = maxId + 1;
    this.nuevaHabitacion.hotel = this.hotelActual?.nombre || '';

    // Una sola llamada al servicio
    this.roomsService.addRoom({...this.nuevaHabitacion});
    
    this.resetearFormularioAgregar();
    this.modalService.dismissAll();

    setTimeout(() => {
      this.isAdding = false;
    }, 500);
  }

  abrirModalEditar(room: Room): void {
    this.habitacionEditando = { ...room };
    this.modalService.open(this.modalEditar, { size: 'lg' });
  }

  actualizarHabitacion(): void {
    if (this.habitacionEditando.number && this.habitacionEditando.type && this.habitacionEditando.hotel) {
      this.roomsService.updateRoom(this.habitacionEditando.id, { ...this.habitacionEditando });
      this.resetearFormularioEditar();
      this.modalService.dismissAll();
    }
  }

  eliminarHabitacion(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta habitación?')) {
      this.roomsService.deleteRoom(id);
    }
  }

  cancelar(): void {
    this.modalService.dismissAll();
    this.resetearFormularioAgregar();
    this.resetearFormularioEditar();
  }

  resetearFormularioAgregar(): void {
    this.nuevaHabitacion = {
      id: 0,
      number: '',
      type: '',
      hotel: this.hotelActual?.nombre || '',
      pricePerNight: 0,
      capacity: 0,
      status: 'Disponible'
    };
  }

  resetearFormularioEditar(): void {
    this.habitacionEditando = {
      id: 0,
      number: '',
      type: '',
      hotel: '',
      pricePerNight: 0,
      capacity: 0,
      status: 'Disponible'
    };
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Disponible': return 'badge bg-success';
      case 'Ocupada': return 'badge bg-danger';
      case 'Mantenimiento': return 'badge bg-warning';
      default: return 'badge bg-secondary';
    }
  }
}