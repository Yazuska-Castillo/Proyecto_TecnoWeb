// rooms.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Room } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private storageKey = 'hilton_habitaciones';
  private rooms$: BehaviorSubject<Room[]>;
  
  constructor() {
    // Inicializar con datos de localStorage o datos por defecto
    const datosIniciales = this.cargarDesdeLocalStorage();
    this.rooms$ = new BehaviorSubject<Room[]>(datosIniciales);
  }

  // Cargar datos desde localStorage
  private cargarDesdeLocalStorage(): Room[] {
    try {
      const datosGuardados = localStorage.getItem(this.storageKey);
      if (datosGuardados) {
        return JSON.parse(datosGuardados);
      }
    } catch (error) {
      console.error('Error al cargar datos de localStorage:', error);
    }
    
    // Datos de ejemplo si no hay nada guardado
    return [
      { 
        id: 1, 
        number: '101', 
        type: 'Standard', 
        hotel: 'Hilton Arica', 
        pricePerNight: 120, 
        capacity: 2, 
        status: 'Disponible' 
      },
      { 
        id: 2, 
        number: '201', 
        type: 'Deluxe', 
        hotel: 'Hilton Arica', 
        pricePerNight: 200, 
        capacity: 3, 
        status: 'Disponible' 
      }
    ];
  }

  // Guardar datos en localStorage
  private guardarEnLocalStorage(rooms: Room[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(rooms));
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }

  getRooms(): Observable<Room[]> {
    return this.rooms$.asObservable();
  }

  addRoom(room: Room): void {
    const currentRooms = this.rooms$.value;
    const newRooms = [...currentRooms, room];
    this.rooms$.next(newRooms); // <- Esto debe emitir el nuevo valor
    this.guardarEnLocalStorage(newRooms);
  }

  updateRoom(id: number, updatedRoom: Room): void {
    const currentRooms = this.rooms$.value;
    const updatedRooms = currentRooms.map(room => 
      room.id === id ? updatedRoom : room
    );
    this.rooms$.next(updatedRooms);
    this.guardarEnLocalStorage(updatedRooms);
  }

  deleteRoom(id: number): void {
    const currentRooms = this.rooms$.value;
    const updatedRooms = currentRooms.filter(room => room.id !== id);
    this.rooms$.next(updatedRooms); // <- Esto debe emitir el nuevo valor
    this.guardarEnLocalStorage(updatedRooms);
  }

  // Método para verificar qué hay en localStorage (debug)
  debugLocalStorage(): void {
    const datos = localStorage.getItem(this.storageKey);
    console.log('Datos en localStorage:', datos);
    console.log('Datos en BehaviorSubject:', this.rooms$.value);
  }
}