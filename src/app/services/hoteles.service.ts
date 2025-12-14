import { Injectable } from '@angular/core';
import { Hotel } from '../models/hotel';
import { HOTELES_PREDEFINIDOS } from 'src/data/hoteles-predefinidos';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root',
})
export class HotelesService {
  private key = 'hoteles_encriptados';

  constructor() {
    // Carga inicial SOLO una vez (encriptada)
    if (!localStorage.getItem(this.key)) {
      const encrypted = CryptoService.encrypt(HOTELES_PREDEFINIDOS);
      localStorage.setItem(this.key, encrypted);
    }
  }

  // Obtener lista de hoteles (DESENCRIPTADO)
  obtenerHoteles(): Hotel[] {
    const data = localStorage.getItem(this.key);
    if (!data) return [];

    try {
      return CryptoService.decrypt(data);
    } catch (error) {
      console.error('Error al desencriptar hoteles', error);
      return [];
    }
  }

  // Guardar lista completa (ENCRIPTADO)
  guardarHoteles(hoteles: Hotel[]): void {
    const encrypted = CryptoService.encrypt(hoteles);
    localStorage.setItem(this.key, encrypted);
  }

  // Agregar un nuevo hotel
  agregarHotel(hotel: Hotel): void {
    const hoteles = this.obtenerHoteles();

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
