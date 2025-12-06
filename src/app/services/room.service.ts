// rooms.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Room } from '../models/room.model';

// 👇 Importar habitaciones predefinidas
import { HABITACIONES } from 'src/data/habitaciones';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private storageKey = 'hilton_habitaciones';
  private roomsSubject: BehaviorSubject<Room[]>;
  
  constructor() {
    const datosIniciales = this.cargarDesdeLocalStorage();
    this.roomsSubject = new BehaviorSubject<Room[]>(datosIniciales);
  }

  // ============================================================
  //   1. CARGAR HABITACIONES (PREDEFINIDAS + LOCALES)
  // ============================================================
  private cargarDesdeLocalStorage(): Room[] {
    let locales: Room[] = [];

    // 1️⃣ Cargar habitaciones guardadas localmente
    try {
      const guardadas = localStorage.getItem(this.storageKey);
      if (guardadas) {
        locales = JSON.parse(guardadas);
      }
    } catch (error) {
      console.error("Error al cargar habitaciones locales:", error);
    }

    // 2️⃣ Convertir HABITACIONES predefinidas al formato Room
    const predefinidas: Room[] = HABITACIONES.map((h, index) => ({
      id: h.id,
      number: String(100 + index),
      type: h.nombre,
      hotel: h.hotel,
      idHotel: h.id,               // 🔥 NECESARIO para las reservas
      pricePerNight: h.precioPorNoche,
      capacity: 2,
      status: 'Disponible'
    }));

    // 3️⃣ Combinar sin duplicar
    const combinadas = [...predefinidas];

    for (const hab of locales) {
      const yaExiste = predefinidas.some(p => p.id === hab.id);
      if (!yaExiste) {
        combinadas.push(hab);
      }
    }

    return combinadas;
  }

  // ============================================================
  //   2. GUARDAR HABITACIONES (SOLO LAS CREADAS POR EL USUARIO)
  // ============================================================
  private guardarEnLocalStorage(rooms: Room[]): void {
    try {
      // ❗ NO guardar habitaciones predefinidas
      const soloLocales = rooms.filter(room =>
        !HABITACIONES.some(p => p.id === room.id)
      );

      localStorage.setItem(this.storageKey, JSON.stringify(soloLocales));
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }

  // ============================================================
  //   3. OBTENER HABITACIONES
  // ============================================================
  getRooms(): Observable<Room[]> {
    return this.roomsSubject.asObservable();
  }

  // ============================================================
  //   4. AGREGAR NUEVA HABITACIÓN (LOCAL)
  // ============================================================
  addRoom(room: Room): void {
    const actual = this.roomsSubject.value;

    // Generar ID correcto (evitar conflicto con predefinidas)
    const maxId = actual.length > 0 ? Math.max(...actual.map(r => r.id)) : 0;
    room.id = maxId + 1;

    const nuevas = [...actual, room];
    this.roomsSubject.next(nuevas);
    this.guardarEnLocalStorage(nuevas);
  }

  // ============================================================
  //   5. EDITAR HABITACIÓN (SI ES LOCAL)
  // ============================================================
  updateRoom(id: number, updatedRoom: Room): void {
    // ❗ No permitir editar predefinidas
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

  // ============================================================
  //   6. ELIMINAR HABITACIÓN (SOLO LOCALES)
  // ============================================================
  deleteRoom(id: number): void {
    // ❗ Bloquear eliminación de predefinidas
    if (HABITACIONES.some(h => h.id === id)) {
      alert("Esta habitación es parte del sistema y no puede eliminarse.");
      return;
    }

    const actual = this.roomsSubject.value;
    const nuevas = actual.filter(room => room.id !== id);

    this.roomsSubject.next(nuevas);
    this.guardarEnLocalStorage(nuevas);
  }

  // ============================================================
  //   7. ACTUALIZAR ESTADO DE HABITACIÓN (Disponible/Ocupada)
  // ============================================================
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
}
