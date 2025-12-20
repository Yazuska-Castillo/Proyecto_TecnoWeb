// rooms.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Room } from '../models/room.model';
import { HABITACIONES } from 'src/data/habitaciones';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private storageKey = 'hilton_habitaciones';
  private imagenesKey = 'hilton_imagenes_'; 
  private roomsSubject: BehaviorSubject<Room[]>;
  
  constructor() {
    const datosIniciales = this.cargarDesdeLocalStorage();
    this.roomsSubject = new BehaviorSubject<Room[]>(datosIniciales);
  }

  private cargarDesdeLocalStorage(): Room[] {
    let locales: Room[] = [];

    // Cargar habitaciones guardadas localmente
    try {
      const guardadas = localStorage.getItem(this.storageKey);
      if (guardadas) {
        locales = JSON.parse(guardadas);
        
        // Para cada habitación local, cargar sus imágenes
        locales = locales.map(habitacion => ({
          ...habitacion,
          images: this.cargarTodasImagenes(habitacion.id)
        }));
      }
    } catch (error) {
      console.error("Error al cargar habitaciones locales:", error);
    }

    // Convertir habitaciones predefinidas al formato Room
    const predefinidas: Room[] = HABITACIONES.map((h, index) => ({
      id: h.id,
      number: String(100 + index),
      type: h.nombre,
      hotel: h.hotel,
      idHotel: h.id,
      pricePerNight: h.precioPorNoche,
      capacity: 2,
      status: 'Disponible',
      description: h.descripcion || '',
      images: [] 
    }));

    const combinadas = [...predefinidas];

    for (const hab of locales) {
      const yaExiste = predefinidas.some(p => p.id === hab.id);
      if (!yaExiste) {
        combinadas.push(hab);
      }
    }

    return combinadas;
  }

  private guardarEnLocalStorage(rooms: Room[]): void {
    try {
      // NO guardar habitaciones predefinidas
      const soloLocales = rooms.filter(room =>
        !HABITACIONES.some(p => p.id === room.id)
      );

      // Guardar solo los datos de la habitación (sin imágenes)
      const habitacionesSinImagenes = soloLocales.map(habitacion => ({
        ...habitacion,
        images: [] // No guardar imágenes aquí, se guardan por separado
      }));

      localStorage.setItem(this.storageKey, JSON.stringify(habitacionesSinImagenes));
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }

  guardarImagen(habitacionId: number, imagenIndex: number, base64Image: string): void {
    const clave = `${this.imagenesKey}${habitacionId}_${imagenIndex}`;
    try {
      localStorage.setItem(clave, base64Image);
    } catch (error) {
      console.error(`❌ Error al guardar imagen ${clave}:`, error);
    }
  }

  cargarImagen(habitacionId: number, imagenIndex: number): string | null {
    const clave = `${this.imagenesKey}${habitacionId}_${imagenIndex}`;
    return localStorage.getItem(clave);
  }

  cargarTodasImagenes(habitacionId: number): string[] {
    const imagenes: string[] = [];
    let index = 0;

    while (true) {
      const clave = `${this.imagenesKey}${habitacionId}_${index}`;
      const imagen = localStorage.getItem(clave);
      
      if (imagen) {
        imagenes.push(imagen); 
        index++;
      } else {
        break;
      }
    }
  
    if (imagenes.length === 0) {
      const habitacionPredefinida = HABITACIONES.find(h => h.id === habitacionId);
      if (habitacionPredefinida && habitacionPredefinida.imagen) {
        console.log(`🛏️ Usando imágenes predefinidas para habitación ${habitacionId}`);
        return [habitacionPredefinida.imagen]; 
      }
    }
    
    return imagenes;
  }

  eliminarImagenesHabitacion(habitacionId: number): void {
    let index = 0;
    let imagenesEliminadas = 0;
    
    while (true) {
      const clave = `${this.imagenesKey}${habitacionId}_${index}`;
      const imagenExiste = localStorage.getItem(clave);
      
      if (imagenExiste) {
        localStorage.removeItem(clave);
        imagenesEliminadas++;
        index++;
      } else {
        break;
      }
    }
  }

  private limpiarImagenesAntiguas(): void {
    const clavesAEliminar: string[] = [];
    
    // Buscar todas las claves de imágenes
    for (let i = 0; i < localStorage.length; i++) {
      const clave = localStorage.key(i);
      if (clave && clave.startsWith(this.imagenesKey)) {
        clavesAEliminar.push(clave);
      }
    }
    
    const aEliminar = clavesAEliminar.slice(0, Math.min(10, clavesAEliminar.length));
    aEliminar.forEach(clave => localStorage.removeItem(clave));
  }

  getRooms(): Observable<Room[]> {
    return this.roomsSubject.asObservable();
  }

  addRoom(room: Room): void {
    const actual = this.roomsSubject.value;

    // Generar ID correcto (evitar conflicto con predefinidas)
    const maxId = actual.length > 0 ? Math.max(...actual.map(r => r.id)) : 0;
    room.id = maxId + 1;

    const nuevas = [...actual, room];
    this.roomsSubject.next(nuevas);
    this.guardarEnLocalStorage(nuevas);
  }

  updateRoom(id: number, updatedRoom: Room): void {
    // No permitir editar predefinidas
    if (HABITACIONES.some(h => h.id === id)) {
      alert("Esta habitación es del sistema y no puede editarse.");
      return;
    }

    const actual = this.roomsSubject.value;
    const nuevas = actual.map(room => 
      room.id === id ? updatedRoom : room
    );

    this.roomsSubject.next(nuevas);
    this.guardarEnLocalStorage(nuevas);
  }

  deleteRoom(id: number): void {
    // Bloquear eliminación de predefinidas
    if (HABITACIONES.some(h => h.id === id)) {
      alert("Esta habitación es parte del sistema y no puede eliminarse.");
      return;
    }

    this.eliminarImagenesHabitacion(id);

    const actual = this.roomsSubject.value;
    const nuevas = actual.filter(room => room.id !== id);

    this.roomsSubject.next(nuevas);
    this.guardarEnLocalStorage(nuevas);
  }

  actualizarEstadoHabitacion(id: number, nuevoEstado: string) {
    const rooms = this.roomsSubject.value;
    const index = rooms.findIndex(r => r.id === id);

    if (index !== -1) {
      rooms[index].status = nuevoEstado;

      // Actualizar observable
      this.roomsSubject.next([...rooms]);

      // Guardar solo locales
      this.guardarEnLocalStorage(rooms);
    }
  }

  getRoomById(id: number): Room | undefined {
    const rooms = this.roomsSubject.value;
    return rooms.find(room => room.id === id);
  }

  contarImagenesTotal(): number {
    let count = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const clave = localStorage.key(i);
      if (clave && clave.startsWith(this.imagenesKey)) {
        count++;
      }
    }
    return count;
  }

  limpiarTodasLasImagenes(): void {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const clave = localStorage.key(i);
      if (clave && clave.startsWith(this.imagenesKey)) {
        localStorage.removeItem(clave);
      }
    }
  }

  obtenerTodasLasHabitacionesCompletas(): Room[] {
    // Obtener todas las habitaciones (predefinidas + locales)
    const locales = this.cargarDesdeLocalStorage();
    const predefinidas: Room[] = HABITACIONES.map((h, index) => ({
      id: h.id,
      number: String(100 + index),
      type: h.nombre,
      hotel: h.hotel,
      pricePerNight: h.precioPorNoche,
      capacity: 2,
      status: 'Disponible',
      description: h.descripcion || '',
      images: []
    }));

    // Combinar sin duplicar
    const combinadas = [...predefinidas];
    for (const hab of locales) {
      const yaExiste = predefinidas.some(p => p.id === hab.id);
      if (!yaExiste) {
        combinadas.push(hab);
      }
    }
    return combinadas;
  }
}
