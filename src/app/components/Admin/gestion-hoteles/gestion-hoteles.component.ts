import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotelesService } from 'src/app/services/hoteles.service';
import { Hotel } from 'src/app/models/hotel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion-hoteles',
  templateUrl: './gestion-hoteles.component.html',
  styleUrls: ['./gestion-hoteles.component.css'],
})
export class GestionHotelesComponent implements OnInit {
  hoteles: Hotel[] = [];
  hotelesFiltrados: Hotel[] = [];

  // filtros
  busqueda: string = '';
  filtroUbicacion: string = '';
  filtroCategoria: string = '';
  ubicaciones: string[] = [];

  formHotel!: FormGroup;
  editando = false;
  hotelSeleccionado: Hotel | null = null;
  mensaje: string = '';

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // formulario de registro / edición
    this.formHotel = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$'),
        ],
      ],
      ubicacion: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$'),
        ],
      ],
      categoria: [
        1,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      habitaciones: [1, [Validators.required, Validators.min(1)]],
    });

    this.cargarHoteles();
  }

  cargarHoteles() {
    this.hoteles = this.hotelService.obtenerHoteles();
    this.hotelesFiltrados = [...this.hoteles];
    this.ubicaciones = [...new Set(this.hoteles.map((h) => h.ubicacion))];
  }

  // aplicar filtros
  aplicarFiltros() {
    this.hotelesFiltrados = this.hoteles.filter((h) => {
      const coincideNombre = h.nombre
        .toLowerCase()
        .includes(this.busqueda.toLowerCase());
      const coincideUbicacion =
        this.filtroUbicacion === '' || h.ubicacion === this.filtroUbicacion;
      const coincideCategoria =
        this.filtroCategoria === '' ||
        h.categoria.toString() === this.filtroCategoria;
      return coincideNombre && coincideUbicacion && coincideCategoria;
    });
  }

  // limpiar filtros
  limpiarFiltros() {
    this.busqueda = '';
    this.filtroUbicacion = '';
    this.filtroCategoria = '';
    this.aplicarFiltros();
  }

  // guardar hotel (agregar o editar)
  guardarHotel() {
    if (this.formHotel.invalid) {
      this.mensaje = 'Complete los campos correctamente';
      return;
    }

    const nuevoHotel: Hotel = {
      id: this.hotelSeleccionado?.id || 0,
      ...this.formHotel.value,
    };

    if (this.editando) {
      this.hotelService.actualizarHotel(nuevoHotel);
      this.mensaje = 'Hotel actualizado';
    } else {
      this.hotelService.agregarHotel(nuevoHotel);
      this.mensaje = 'Hotel agregado';
    }

    this.formHotel.reset();
    this.cancelarEdicion();
    this.cargarHoteles();
  }

  // activar modo edición
  editarHotel(hotel: Hotel) {
    this.editando = true;
    this.hotelSeleccionado = hotel;
    this.formHotel.patchValue(hotel);
  }

  // eliminar hotel
  eliminarHotel(id: number) {
    if (confirm('¿Eliminar este hotel?')) {
      this.hotelService.eliminarHotel(id);
      this.mensaje = 'Hotel eliminado';
      this.cargarHoteles();
    }
  }

  // cancelar edición
  cancelarEdicion() {
    this.editando = false;
    this.hotelSeleccionado = null;
    this.formHotel.reset();
  }

  // abrir modal para agregar
  abrirModalAgregar() {
    this.editando = false;
    this.hotelSeleccionado = null;
    this.formHotel.reset();
  }

  // abrir modal para editar
  abrirModalEditar(hotel: any) {
    this.editando = true;
    this.hotelSeleccionado = hotel;
    this.formHotel.patchValue(hotel);
  }

  // navegar a habitaciones del hotel
  verHabitacionesHotel(hotelId: number): void {
    this.router.navigate(['/admin/habitaciones'], {
      queryParams: { hotelId: hotelId },
    });
  }
}
