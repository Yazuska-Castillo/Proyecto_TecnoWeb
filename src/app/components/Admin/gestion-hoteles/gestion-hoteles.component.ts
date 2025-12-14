import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  imagenesError = '';

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
      imagenes: [[], [Validators.required, Validators.minLength(4)]],
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

  cargarImagenesPorUrl(urls: string[]) {
    this.imagenesPreview = urls;
    this.formHotel.get('imagenes')?.setValue(urls);
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

  onImagenesSeleccionadas(event: any) {
    const files: File[] = Array.from(event.target.files);
    this.imagenesPreview = [];
    this.imagenesError = '';

    if (files.length < 4) {
      this.imagenesError = 'Debe seleccionar al menos 4 imágenes';
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        this.imagenesError = 'Solo se permiten imágenes';
        return;
      }

      // 🔹 Simulación de backend
      const rutaSimulada = `assets/img/HotelesFotos/${file.name}`;
      this.imagenesPreview.push(rutaSimulada);
    });

    // 🔹 Guardamos SOLO texto (rutas)
    this.formHotel.get('imagenes')?.setValue(this.imagenesPreview);
  }

  guardarHotel() {
    console.log('FORM VALUE', this.formHotel.value);
    console.log('IMAGENES', this.formHotel.get('imagenes')?.value);
    const imagenes = this.formHotel.get('imagenes')?.value || [];

    if (this.formHotel.invalid || imagenes.length < 4) {
      this.formHotel.markAllAsTouched();
      return;
    }

    const hotel: Hotel = {
      id: this.hotelSeleccionado?.id || 0,
      ...this.formHotel.value,
    };

    if (this.editando) {
      this.hotelService.actualizarHotel(hotel);
    } else {
      this.hotelService.agregarHotel(hotel);
    }

    this.cancelarEdicion();
    this.cargarHoteles();
  }

  abrirModalAgregar() {
    this.editando = false;
    this.hotelSeleccionado = null;
    this.formHotel.reset({ categoria: 1, habitaciones: 1 });
    this.imagenesPreview = [];
  }

  abrirModalEditar(hotel: Hotel) {
    this.editando = true;
    this.hotelSeleccionado = hotel;
    this.formHotel.patchValue(hotel);
    this.imagenesPreview = [...hotel.imagenes];
  }

  eliminarHotel(id: number) {
    if (confirm('¿Eliminar este hotel?')) {
      this.hotelService.eliminarHotel(id);
      this.cargarHoteles();
    }
  }

  cancelarEdicion() {
    this.editando = false;
    this.hotelSeleccionado = null;
    this.formHotel.reset();
    this.imagenesPreview = [];
  }

  verHabitacionesHotel(hotelId: number) {
    this.router.navigate(['/admin/habitaciones'], {
      queryParams: { hotelId },
    });
  }
}
