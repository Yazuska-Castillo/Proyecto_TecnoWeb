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
  formHotel!: FormGroup;
  editando = false;
  hotelSeleccionado: Hotel | null = null;
  mensaje: string = '';

  constructor(
    private fb: FormBuilder, private hotelService: HotelesService, private router: Router) {} // ← Inyectar Router

  ngOnInit(): void {
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
  }

  guardarHotel() {
    if (this.formHotel.invalid) {
      this.mensaje = 'Por favor completa los campos correctamente';
      return;
    }

    const nuevoHotel: Hotel = {
      id: this.hotelSeleccionado?.id || 0,
      ...this.formHotel.value,
    };

    if (this.editando) {
      this.hotelService.actualizarHotel(nuevoHotel);
      this.mensaje = 'Hotel actualizado correctamente';
    } else {
      this.hotelService.agregarHotel(nuevoHotel);
      this.mensaje = 'Hotel agregado correctamente';
    }

    this.formHotel.reset();
    this.cancelarEdicion();
    this.cargarHoteles();
  }

  editarHotel(hotel: Hotel) {
    this.editando = true;
    this.hotelSeleccionado = hotel;
    this.formHotel.patchValue(hotel);
  }

  eliminarHotel(id: number) {
    if (confirm('¿Deseas eliminar este hotel?')) {
      this.hotelService.eliminarHotel(id);
      this.mensaje = 'Hotel eliminado';
      this.cargarHoteles();
    }
  }

  cancelarEdicion() {
    this.editando = false;
    this.hotelSeleccionado = null;
    this.formHotel.reset();
  }
  abrirModalAgregar() {
    this.editando = false;
    this.hotelSeleccionado = null;
    this.formHotel.reset();
  }

  abrirModalEditar(hotel: any) {
    this.editando = true;
    this.hotelSeleccionado = hotel;
    this.formHotel.patchValue(hotel);
  }

  verHabitacionesHotel(hotelId: number): void {
    this.router.navigate(['/admin/habitaciones'], { 
      queryParams: { hotelId: hotelId } 
    });
  }
}
