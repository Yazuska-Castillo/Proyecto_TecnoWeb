import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { Hotel } from 'src/app/models/hotel';
import { HotelesService } from 'src/app/services/hoteles.service';

@Component({
  selector: 'app-gestion-hoteles',
  templateUrl: './gestion-hoteles.component.html',
  styleUrls: ['./gestion-hoteles.component.css'],
})
export class GestionHotelesComponent implements OnInit {
  hoteles: Hotel[] = [];
  hotelesFiltrados: Hotel[] = [];

  ubicacionesDisponibles: string[] = [
    'Arica',
    'Iquique',
    'Antofagasta',
    'Santiago',
    'Valparaíso',
    'Viña del Mar',
    'Buenos Aires',
    'Lima',
    'Cusco',
    'Río de Janeiro',
    'São Paulo',
    'Bogotá',
    'Medellín',
    'Cancún',
    'Playa del Carmen',
    'Miami',
    'Nueva York',
    'Los Ángeles',
    'Las Vegas',
    'Madrid',
    'Barcelona',
    'París',
    'Roma',
    'Londres',
    'Dubái',
    'Bangkok',
    'Tokio',
  ];
  busqueda = '';
  filtroUbicacion = '';
  filtroCategoria = '';
  ubicaciones: string[] = [];

  formHotel!: FormGroup;
  editando = false;
  hotelSeleccionado: Hotel | null = null;

  imagenesPreview: string[] = []; 
  imagenesError: string = '';
  archivosSeleccionados: File[] = []; 
  
  archivosSeleccionadosEditar: File[] = [];

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formHotel = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      ubicacion: ['', Validators.required],
      categoria: [
        1,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      habitaciones: [1, [Validators.required, Validators.min(1)]],
      descripcion: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(500),
        ],
      ],
      mapaUrl: [
        '',
        [
          Validators.required,
          Validators.pattern('^https://www.google.com/maps/embed.+'),
        ],
      ],
    });

    this.cargarHoteles();
  }

  cargarHoteles() {
    this.hoteles = this.hotelService.obtenerHoteles();
    this.hotelesFiltrados = [...this.hoteles];
    this.ubicaciones = [...new Set(this.hoteles.map((h) => h.ubicacion))];
  }

  aplicarFiltros() {
    this.hotelesFiltrados = this.hoteles.filter((h) => {
      const nombre = h.nombre
        .toLowerCase()
        .includes(this.busqueda.toLowerCase());
      const ubicacion =
        !this.filtroUbicacion || h.ubicacion === this.filtroUbicacion;
      const categoria =
        !this.filtroCategoria ||
        h.categoria.toString() === this.filtroCategoria;
      return nombre && ubicacion && categoria;
    });
  }

  limpiarFiltros() {
    this.busqueda = '';
    this.filtroUbicacion = '';
    this.filtroCategoria = '';
    this.aplicarFiltros();
  }

  onImagenesSeleccionadas(event: any): void {
    const input = event.target as HTMLInputElement;
    
    if (!input.files || input.files.length === 0) {
      return;
    }
    
    const archivos: File[] = Array.from(input.files);
    this.imagenesError = '';
    
    // Validar cantidad máxima
    const totalImagenes = this.editando 
      ? (this.hotelSeleccionado?.imagenes?.length || 0) + archivos.length
      : archivos.length;
    
    if (totalImagenes > 10) {
      this.imagenesError = 'Máximo 10 imágenes permitidas por hotel';
      return;
    }
    
    // Validar tamaño y tipo
    const maxSize = 5 * 1024 * 1024;
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

    if (this.editando) {
      this.archivosSeleccionadosEditar = [
        ...this.archivosSeleccionadosEditar, 
        ...archivos as File[]
      ];
    } else {
      this.archivosSeleccionados = [
        ...this.archivosSeleccionados, 
        ...archivos as File[]
      ];
    }

    for (let i = 0; i < archivos.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenesPreview.push(e.target.result as string);
      };
      reader.readAsDataURL(archivos[i]);
    }

    input.value = '';
  }

  eliminarImagenPreview(index: number): void {
    this.imagenesPreview.splice(index, 1);
    
    if (this.editando) {
      this.archivosSeleccionadosEditar.splice(index, 1);
    } else {
      this.archivosSeleccionados.splice(index, 1);
    }
  }

  eliminarImagenExistente(index: number): void {
    if (this.hotelSeleccionado && this.hotelSeleccionado.imagenes) {
      this.hotelService.eliminarImagenHotel(this.hotelSeleccionado.id, index);
      this.hotelSeleccionado.imagenes.splice(index, 1);
    }
  }

  async guardarHotel(): Promise<void> {
    // Validar formulario
    if (this.formHotel.invalid) {
      this.formHotel.markAllAsTouched();
      return;
    }

    // Validar imágenes
    const totalImagenes = this.editando 
      ? (this.hotelSeleccionado?.imagenes?.length || 0) + this.imagenesPreview.length
      : this.imagenesPreview.length;

    if (totalImagenes < 2) {
      this.imagenesError = 'Debe seleccionar al menos 2 imágenes';
      return;
    }

    // Preparar datos del hotel
    const hotelData = {
      id: this.hotelSeleccionado?.id || 0,
      ...this.formHotel.value,
    };

    if (this.editando && this.hotelSeleccionado) {
      const nuevasImagenesBase64: string[] = [];
      if (this.archivosSeleccionadosEditar.length > 0) {
        nuevasImagenesBase64.push(...await this.procesarArchivosABase64(this.archivosSeleccionadosEditar));
      }

      const todasLasImagenes = [
        ...(this.hotelSeleccionado.imagenes || []),
        ...nuevasImagenesBase64
      ];

      const hotelActualizado: Hotel = {
        ...hotelData,
        id: this.hotelSeleccionado.id,
        imagenes: todasLasImagenes
      };
      
      console.log(`✏️ Actualizando hotel ${hotelActualizado.nombre} con ${todasLasImagenes.length} imágenes`);
      this.hotelService.actualizarHotel(hotelActualizado);
      
    } else {
      const imagenesBase64 = await this.procesarArchivosABase64(this.archivosSeleccionados);

      const nuevoHotel: Hotel = {
        ...hotelData,
        imagenes: imagenesBase64
      };
      
      console.log(`🏨 Creando nuevo hotel ${nuevoHotel.nombre} con ${imagenesBase64.length} imágenes`);
      this.hotelService.agregarHotel(nuevoHotel);
    }

    this.cancelarEdicion();
    this.cargarHoteles();
  }

  private async procesarArchivosABase64(archivos: File[]): Promise<string[]> {
    const promesas = archivos.map(archivo => this.fileToBase64(archivo));
    return await Promise.all(promesas);
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        resolve(e.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  abrirModalAgregar() {
    this.editando = false;
    this.hotelSeleccionado = null;
    this.formHotel.reset({ 
      categoria: 1, 
      habitaciones: 1 
    });
    
    // Limpiar imágenes
    this.imagenesPreview = [];
    this.archivosSeleccionados = [];
    this.imagenesError = '';
  }

  abrirModalEditar(hotel: Hotel) {
    this.editando = true;

    const hotelCompleto = this.hotelService.getHotelById(hotel.id) || hotel;
    this.hotelSeleccionado = { ...hotelCompleto };
    
    this.formHotel.patchValue({
      nombre: hotelCompleto.nombre,
      ubicacion: hotelCompleto.ubicacion,
      categoria: hotelCompleto.categoria,
      habitaciones: hotelCompleto.habitaciones,
      descripcion: hotelCompleto.descripcion,
      mapaUrl: hotelCompleto.mapaUrl
    });
    
    // Limpiar imágenes nuevas (mantener las existentes en hotelSeleccionado.imagenes)
    this.imagenesPreview = [];
    this.archivosSeleccionadosEditar = [];
    this.imagenesError = '';
    
    console.log(`📂 Editando hotel: ${hotelCompleto.nombre} con ${hotelCompleto.imagenes?.length || 0} imágenes`);
  }

  eliminarHotel(id: number) {
    if (confirm('¿Eliminar este hotel y todas sus imágenes?')) {
      console.log(`🗑️ Eliminando hotel ID: ${id}`);
      this.hotelService.eliminarHotel(id);
      this.cargarHoteles();
    }
  }

  cancelarEdicion() {
    this.editando = false;
    this.hotelSeleccionado = null;
    this.formHotel.reset({
      categoria: 1,
      habitaciones: 1
    });

    this.imagenesPreview = [];
    this.archivosSeleccionados = [];
    this.archivosSeleccionadosEditar = [];
    this.imagenesError = '';
  }

  cerrarModal(): void {
  const modalElement = document.getElementById('hotelModal');
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }
}

  verHabitacionesHotel(hotelId: number) {
    this.router.navigate(['/admin/habitaciones'], {
      queryParams: { hotelId },
    });
  }

  debugInfo(): void {
    console.log('=== DEBUG HOTELES ===');
    console.log('Hoteles cargados:', this.hoteles.length);
    console.log('Hotel seleccionado:', this.hotelSeleccionado);
    console.log('Imágenes preview:', this.imagenesPreview.length);
    console.log('Archivos seleccionados:', this.archivosSeleccionados.length);
    console.log('Archivos edición:', this.archivosSeleccionadosEditar.length);
    
    // Info del service
    const totalImagenes = this.hotelService.contarImagenesHoteles();
    const espacio = this.hotelService.obtenerEspacioImagenes();
    console.log(`📊 Service: ${totalImagenes} imágenes totales`);
    console.log(`💾 Espacio: ${espacio}`);
  }

  // Método para forzar recarga de imágenes (si hay problemas de cache)
  recargarImagenesHotel(hotelId: number): void {
    console.log(`🔄 Recargando imágenes del hotel ${hotelId}`);
    const hotel = this.hotelService.getHotelById(hotelId);
    if (hotel) {
      console.log(`✅ Hotel recargado con ${hotel.imagenes?.length || 0} imágenes`);
    }
  }
}