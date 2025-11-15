// rooms.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Room } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private storageKey = 'hilton_habitaciones';
  private roomsSubject: BehaviorSubject<Room[]>;
  
  constructor() {
    // INICIALIZAR UNA SOLA VEZ
    const datosIniciales = this.cargarDesdeLocalStorage();
    this.roomsSubject = new BehaviorSubject<Room[]>(datosIniciales);
  }

  private cargarDesdeLocalStorage(): Room[] {
    try {
      const datosGuardados = localStorage.getItem(this.storageKey);
      if (datosGuardados) {
        return JSON.parse(datosGuardados);
      }
    } catch (error) {
      console.error('Error al cargar datos de localStorage:', error);
    }
    
    // Datos iniciales mínimos
    return [];
  }

  private guardarEnLocalStorage(rooms: Room[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(rooms));
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }

  // ✅ SOLO UN Observable - no crear nuevos cada vez
  getRooms(): Observable<Room[]> {
    return this.roomsSubject.asObservable();
  }

  addRoom(room: Room): void {
    console.log('=== ADD ROOM CALLED ===');
    console.log('Room to add:', room);
    
    const currentRooms = this.roomsSubject.value;
    console.log('Current rooms before:', currentRooms.length);
    
    const newRooms = [...currentRooms, room];
    console.log('New rooms after:', newRooms.length);
    
    this.roomsSubject.next(newRooms);
    this.guardarEnLocalStorage(newRooms);
    
    console.log('=== ADD ROOM COMPLETED ===');
  }

  updateRoom(id: number, updatedRoom: Room): void {
    const currentRooms = this.roomsSubject.value;
    const updatedRooms = currentRooms.map(room => 
      room.id === id ? updatedRoom : room
    );
    this.roomsSubject.next(updatedRooms);
    this.guardarEnLocalStorage(updatedRooms);
  }

  deleteRoom(id: number): void {
    const currentRooms = this.roomsSubject.value;
    const updatedRooms = currentRooms.filter(room => room.id !== id);
    this.roomsSubject.next(updatedRooms);
    this.guardarEnLocalStorage(updatedRooms);
  }
}