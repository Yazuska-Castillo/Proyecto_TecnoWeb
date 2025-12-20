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

  // Propiedades para imágenes
  imagenesPreview: string[] = [];
  imagenesPreviewEditar: string[] = [];
  imagenesError: string = '';
  archivosSeleccionados: File[] = [];
  archivosSeleccionadosEditar: File[] = [];

  nuevaHabitacion: Room = {
    id: 0,
    number: '',
    type: '',
    hotel: '',
    pricePerNight: undefined,
    capacity: 0,
    status: 'Disponible',
    description: '',
    images: [] // Este array guardará los Base64 de las imágenes
  };

  habitacionEditando: Room = {
    id: 0,
    number: '',
    type: '',
    hotel: '',
    pricePerNight: undefined,
    capacity: 0,
    status: 'Disponible',
    description: '',
    images: []
  };

  constructor(
    private roomsService: RoomsService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private hotelesService: HotelesService
  ) { }

  ngOnInit(): void {
    // Cargar habitaciones con sus imágenes
    this.roomsService.getRooms().subscribe(habitaciones => {
      // Para cada habitación, cargar las imágenes desde localStorage
      const habitacionesConImagenes = habitaciones.map(habitacion => {
        const imagenesCargadas = this.roomsService.cargarTodasImagenes(habitacion.id);
        return {
          ...habitacion,
          images: imagenesCargadas
        };
      });
      
      this.procesarHabitaciones(habitacionesConImagenes);
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
    // Limpiar imágenes previas al abrir modal
    this.imagenesPreview = [];
    this.archivosSeleccionados = [];
    this.imagenesError = '';
    
    this.modalService.open(this.modalAgregar, { size: 'lg' });
  }

  async agregarHabitacion(): Promise<void> {
    if (this.isAdding) return;

    // Número único en el hotel
    if (this.nuevaHabitacion.number && this.hotelActual) {const existe = this.existeHabitacionConMismoNumero(this.nuevaHabitacion.number, this.hotelActual.nombre);
      if (existe) {
        this.imagenesError = `Ya existe una habitación con el número ${this.nuevaHabitacion.number} en ${this.hotelActual.nombre}`;
        return;
      }
    }

    // Validar que el formulario esté completo
    if (!this.nuevaHabitacion.number || !this.nuevaHabitacion.type || !this.habilitarAgregar) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    // Validar imágenes
    if (this.imagenesPreview.length === 0) {
      this.imagenesError = 'Debe seleccionar al menos 1 imagen';
      return;
    }

    this.isAdding = true;

    try {
      // Obtener el ID correcto del SERVICE, no del array local
      const todasLasHabitaciones = this.roomsService.obtenerTodasLasHabitacionesCompletas();
      let maxId = 0;
      
      // Buscar el ID máximo entre TODAS las habitaciones (predefinidas y locales)
      if (todasLasHabitaciones.length > 0) {
        maxId = Math.max(...todasLasHabitaciones.map(r => r.id));
      }
      
      const nuevoId = maxId + 1;
      const promesasImagenes = this.archivosSeleccionados.map((archivo, index) => {
        return new Promise<void>((resolve) => {
          const reader = new FileReader();
          
          reader.onload = (e: any) => {
            const base64Image = e.target.result;
            
            // Guardar imagen ANTES de crear la habitación
            this.roomsService.guardarImagen(nuevoId, index, base64Image);
            resolve();
          };
          
          reader.readAsDataURL(archivo);
        });
      });

      // Esperar a que TODAS las imágenes se guarden
      await Promise.all(promesasImagenes);

      // Cargar las imágenes guardadas
      const imagenesCargadas = this.roomsService.cargarTodasImagenes(nuevoId);
      
      // Crear la habitación
      const nuevaHabitacion: Room = {
        id: nuevoId,
        number: this.nuevaHabitacion.number,
        type: this.nuevaHabitacion.type,
        hotel: this.hotelActual?.nombre || '',
        pricePerNight: this.nuevaHabitacion.pricePerNight,
        capacity: this.nuevaHabitacion.capacity,
        status: 'Disponible',
        description: this.nuevaHabitacion.description,
        images: imagenesCargadas
      };

      // Guardar la habitación
      this.roomsService.addRoom(nuevaHabitacion);

      // Actualizar la lista local
      this.roomsService.getRooms().subscribe(habitaciones => {
        const habitacionesConImagenes = habitaciones.map(habitacion => {
          const imagenesCargadas = this.roomsService.cargarTodasImagenes(habitacion.id);
          return {
            ...habitacion,
            images: imagenesCargadas
          };
        });
        
        this.procesarHabitaciones(habitacionesConImagenes);
      });

      // LIMPIAR y cerrar
      this.resetearFormularioAgregar();
      this.imagenesPreview = [];
      this.archivosSeleccionados = [];
      this.imagenesError = '';
      this.modalService.dismissAll();
      
    } catch (error) {
      this.imagenesError = 'Error al guardar la habitación';
    } finally {
      this.isAdding = false;
    }
  }

  abrirModalEditar(room: Room): void {
    // Cargar las imágenes de esta habitación desde localStorage
    const imagenesCargadas = this.roomsService.cargarTodasImagenes(room.id);
    
    this.habitacionEditando = { 
      ...room,
      images: imagenesCargadas
    };
    
    // Limpiar imágenes nuevas
    this.imagenesPreviewEditar = [];
    this.archivosSeleccionadosEditar = [];
    
    this.modalService.open(this.modalEditar, { size: 'lg' });
  }

  async actualizarHabitacion(): Promise<void> {

    // VALIDACIÓN: Número único en el hotel (excluyendo la actual)
    if (this.habitacionEditando.number && this.habitacionEditando.hotel) {const existe = this.existeHabitacionConMismoNumero(this.habitacionEditando.number, this.habitacionEditando.hotel, this.habitacionEditando.id);    
      if (existe) {
        alert(`Ya existe una habitación con el número ${this.habitacionEditando.number} en ${this.habitacionEditando.hotel}`);
        return;
      }
    }

    if (!this.habitacionEditando.number || !this.habitacionEditando.type) {
      return;
    }

    // Si hay nuevas imágenes, guardarlas en localStorage
    if (this.archivosSeleccionadosEditar.length > 0) {
      const inicioIndex = this.habitacionEditando.images.length;
      
      for (let i = 0; i < this.archivosSeleccionadosEditar.length; i++) {
        const archivo = this.archivosSeleccionadosEditar[i];
        const reader = new FileReader();
        
        reader.onload = (e: any) => {
          const base64Image = e.target.result;
          // Guardar nueva imagen después de las existentes
          this.roomsService.guardarImagen(
            this.habitacionEditando.id, 
            inicioIndex + i, 
            base64Image
          );
        };
        
        reader.readAsDataURL(archivo);
      }
      
      // Esperar un momento para que se guarden las imágenes
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Actualizar la habitación en el servicio
    this.roomsService.updateRoom(this.habitacionEditando.id, { 
      ...this.habitacionEditando 
    });

    // Limpiar y cerrar
    this.resetearFormularioEditar();
    this.imagenesPreviewEditar = [];
    this.archivosSeleccionadosEditar = [];
    this.modalService.dismissAll();
  }

  eliminarHabitacion(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta habitación y todas sus imágenes?')) {
      // Eliminar las imágenes de localStorage
      this.roomsService.eliminarImagenesHabitacion(id);
      
      // Eliminar la habitación
      this.roomsService.deleteRoom(id);
    }
  }

  eliminarImagenExistente(index: number): void {
    // Eliminar del array visual
    this.habitacionEditando.images.splice(index, 1);
    
    // Reorganizar todas las imágenes en localStorage
    this.reorganizarImagenesHabitacion(this.habitacionEditando.id);
  }

  private reorganizarImagenesHabitacion(habitacionId: number): void {
    // Eliminar todas las imágenes actuales de localStorage
    this.roomsService.eliminarImagenesHabitacion(habitacionId);
    
    // Guardar las imágenes restantes nuevamente
    this.habitacionEditando.images.forEach((imagen, nuevoIndex) => {
      this.roomsService.guardarImagen(habitacionId, nuevoIndex, imagen);
    });
  }

  cancelar(): void {
    this.modalService.dismissAll();
    this.resetearFormularioAgregar();
    this.resetearFormularioEditar();
    this.imagenesPreview = [];
    this.imagenesPreviewEditar = [];
    this.archivosSeleccionados = [];
    this.archivosSeleccionadosEditar = [];
    this.imagenesError = '';
  }

  resetearFormularioAgregar(): void {
    this.nuevaHabitacion = {
      id: 0,
      number: '',
      type: '',
      hotel: this.hotelActual?.nombre || '',
      pricePerNight: undefined,
      capacity: 0,
      status: 'Disponible',
      description: '',
      images: []
    };
  }

  resetearFormularioEditar(): void {
    this.habitacionEditando = {
      id: 0,
      number: '',
      type: '',
      hotel: '',
      pricePerNight: undefined,
      capacity: 0,
      status: 'Disponible',
      description: '',
      images: []
    };
  }

  // Metodo para manejar imagenes
  onImagenesSeleccionadas(event: any): void {
  const archivos = event.target.files;
  this.imagenesError = '';
  
  if (!archivos || archivos.length === 0) {
    return;
  }
  
  // Validar cantidad
  if (archivos.length > 10) {
    this.imagenesError = 'Máximo 10 imágenes permitidas';
    return;
  }
  
  // Validar tamaño y tipo
  const maxSize = 5 * 1024 * 1024; // 5MB
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
  
  for (let i = 0; i < archivos.length; i++) {
    const archivo = archivos[i];
    
    if (!tiposPermitidos.includes(archivo.type)) {
      this.imagenesError = `El archivo ${archivo.name} no es una imagen válida (solo JPG, PNG, WebP)`;
      return;
    }
    
    if (archivo.size > maxSize) {
      this.imagenesError = `La imagen ${archivo.name} es muy grande (máximo 5MB)`;
      return;
    }
  }
  
  // Guardar los archivos reales
  this.archivosSeleccionados = Array.from(archivos);
  
  // Crear previews
  this.imagenesPreview = [];
  for (let i = 0; i < archivos.length; i++) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagenesPreview.push(e.target.result);
    };
    reader.readAsDataURL(archivos[i]);
  }
}

  onImagenesSeleccionadasEditar(event: any): void {
    const archivos = event.target.files;
    
    if (!archivos || archivos.length === 0) {
      return;
    }
    
    // Guardar los archivos
    this.archivosSeleccionadosEditar = Array.from(archivos);
    
    // Crear previews
    this.imagenesPreviewEditar = [];
    for (let i = 0; i < archivos.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenesPreviewEditar.push(e.target.result);
      };
      reader.readAsDataURL(archivos[i]);
    }
  }

  eliminarImagenPreview(index: number): void {
    this.imagenesPreview.splice(index, 1);
    this.archivosSeleccionados.splice(index, 1);
  }

  eliminarImagenNueva(index: number): void {
    this.imagenesPreviewEditar.splice(index, 1);
    this.archivosSeleccionadosEditar.splice(index, 1);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Disponible': return 'badge bg-success';
      case 'Ocupada': return 'badge bg-danger';
      case 'Mantenimiento': return 'badge bg-warning';
      default: return 'badge bg-secondary';
    }
  }

  // Método para verificar si ya existe una habitación con el mismo número en el mismo hotel
  private existeHabitacionConMismoNumero(numeroHabitacion: string, hotel: string, idExcluir?: number): boolean {
    // Convertir a string y limpiar espacios
    const numero = numeroHabitacion.toString().trim();
    const nombreHotel = hotel.trim();
    
    // Buscar en todas las habitaciones
    return this.rooms.some(habitacion => {
      // Excluir la habitación que se está editando (si se proporciona id)
      if (idExcluir && habitacion.id === idExcluir) {
        return false;
      }
      
      // Verificar mismo hotel y mismo número
      return habitacion.hotel === nombreHotel && 
            habitacion.number.toString().trim() === numero;
    });
  }

  // Método para obtener mensaje de error
  getErrorNumeroRepetido(): string {
    if (!this.nuevaHabitacion.number || !this.hotelActual) {
      return '';
    }
    
    const existe = this.existeHabitacionConMismoNumero(
      this.nuevaHabitacion.number, 
      this.hotelActual.nombre
    );
    
    if (existe) {
      return `⚠️ Ya existe una habitación con el número ${this.nuevaHabitacion.number} en el hotel`;
    }
    
    return '';
  }

  // Método similar para edición
  getErrorNumeroRepetidoEdicion(): string {
    if (!this.habitacionEditando.number || !this.habitacionEditando.hotel) {
      return '';
    }
    
    const existe = this.existeHabitacionConMismoNumero(
      this.habitacionEditando.number, 
      this.habitacionEditando.hotel,
      this.habitacionEditando.id // Excluir la habitación que se está editando
    );
    
    if (existe) {
      return `⚠️ Ya existe una habitación con el número ${this.habitacionEditando.number} en el hotel`;
    }
    
    return '';
  }

  // Método para validar cuando el usuario sale del campo (agregar)
  onBlurNumero(): void {
    // Forzar la validación
    if (this.nuevaHabitacion.number && this.hotelActual) {
      const existe = this.existeHabitacionConMismoNumero(
        this.nuevaHabitacion.number,
        this.hotelActual.nombre
      );
    }
  }

  // Método para validar cuando el usuario sale del campo (editar)
  onBlurNumeroEditar(): void {
    // Forzar la validación
    if (this.habitacionEditando.number && this.habitacionEditando.hotel) {
      const existe = this.existeHabitacionConMismoNumero(
        this.habitacionEditando.number,
        this.habitacionEditando.hotel,
        this.habitacionEditando.id
      );
    }
  }
}