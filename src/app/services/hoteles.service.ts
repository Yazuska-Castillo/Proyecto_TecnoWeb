import { Injectable } from '@angular/core';
import { Hotel } from '../models/hotel';
import { HOTELES_PREDEFINIDOS } from 'src/data/hoteles-predefinidos';

@Injectable({
  providedIn: 'root',
})
export class HotelesService {
  private key = 'hoteles';

  constructor() {
    // Carga inicial si no existe en localStorage
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify(HOTELES_PREDEFINIDOS));
    }
  }

  // Obtener lista de hoteles
  obtenerHoteles(): Hotel[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  // Guardar lista completa
  guardarHoteles(hoteles: Hotel[]): void {
    localStorage.setItem(this.key, JSON.stringify(hoteles));
  }

  // Agregar un nuevo hotel
  agregarHotel(hotel: Hotel): void {
    const hoteles = this.obtenerHoteles();

    // Generar ID
    hotel.id =
      hoteles.length > 0 ? Math.max(...hoteles.map((h) => h.id)) + 1 : 1;

    hoteles.push(hotel);
    this.guardarHoteles(hoteles);
  }

  // Editar hotel existente
  actualizarHotel(hotel: Hotel): void {
    const hoteles = this.obtenerHoteles().map((h) =>
      h.id === hotel.id ? hotel : h
    );
    this.guardarHoteles(hoteles);
  }

  // Eliminar hotel
  eliminarHotel(id: number): void {
    const hoteles = this.obtenerHoteles().filter((h) => h.id !== id);
    this.guardarHoteles(hoteles);
  }
}
