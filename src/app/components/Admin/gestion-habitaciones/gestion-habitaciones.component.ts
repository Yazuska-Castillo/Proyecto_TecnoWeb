import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // ← Agregar esto
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Room } from 'src/app/models/room.model';
import { RoomsService } from 'src/app/services/room.service';
import { HotelesService } from 'src/app/services/hoteles.service'; // ← Agregar esto
import { Hotel } from 'src/app/models/hotel'; //

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
    // PRIMERO: Obtener el hotelId
    this.route.queryParams.subscribe(params => {
      this.hotelId = params['hotelId'] ? +params['hotelId'] : null;
      
      if (this.hotelId) {
        this.cargarHotelActual();
      }
      
      // LUEGO: Cargar y filtrar habitaciones
      this.cargarYFiltrarHabitaciones();
    });
  }

  private cargarHotelActual(): void {
    const hoteles = this.hotelesService.obtenerHoteles();
    this.hotelActual = hoteles.find(h => h.id === this.hotelId) || null;
    
    if (this.hotelActual) {
      this.nuevaHabitacion.hotel = this.hotelActual.nombre;
      this.limiteHabitaciones = this.hotelActual.habitaciones;
      console.log('Hotel:', this.hotelActual.nombre, 'Límite:', this.limiteHabitaciones);
    }
  }

  private cargarYFiltrarHabitaciones(): void {
    this.roomsService.getRooms().subscribe(todasLasHabitaciones => {
      if (this.hotelActual) {
        // FILTRO EXACTO por nombre del hotel
        this.rooms = todasLasHabitaciones.filter(room => 
          room.hotel === this.hotelActual!.nombre
        );
        console.log('Habitaciones filtradas:', this.rooms);
      } else {
        this.rooms = todasLasHabitaciones;
      }
      
      // ACTUALIZAR CONTADOR
      this.actualizarContadorHabitaciones();
    });
  }

  private actualizarContadorHabitaciones(): void {
    if (this.hotelActual) {
      this.habitacionesCreadas = this.rooms.length;
      this.habilitarAgregar = this.habitacionesCreadas < this.limiteHabitaciones;
      console.log(`Contador: ${this.habitacionesCreadas}/${this.limiteHabitaciones}`);
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

  // Método para obtener el nombre del hotel (CORREGIDO)
  public getNombreHotel(): string {
    return this.hotelActual?.nombre || 'Hotel no encontrado';
  }

  // === MÉTODOS PARA AGREGAR ===
  abrirModalAgregar(): void {
    this.modalService.open(this.modalAgregar, { size: 'lg' });
  }

  agregarHabitacion(): void {
    if (this.nuevaHabitacion.number && this.nuevaHabitacion.type && this.habilitarAgregar) {
      this.roomsService.getRooms().subscribe(todasLasHabitaciones => {
        const maxId = todasLasHabitaciones.length > 0 ? 
          Math.max(...todasLasHabitaciones.map(r => r.id)) : 0;
        
        this.nuevaHabitacion.id = maxId + 1;
        this.nuevaHabitacion.hotel = this.hotelActual?.nombre || '';
        
        this.roomsService.addRoom({...this.nuevaHabitacion});
        this.resetearFormularioAgregar();
        this.modalService.dismissAll();
        
        // El contador se actualiza automáticamente por la suscripción
      });
    }
  }

  // === MÉTODOS PARA EDITAR ===
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
    hotel: this.getNombreHotel(), // Siempre el hotel actual
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

  eliminarHabitacion(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta habitación?')) {
      this.roomsService.deleteRoom(id);
    }
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