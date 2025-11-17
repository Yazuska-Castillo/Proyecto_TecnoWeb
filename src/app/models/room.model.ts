export interface Room {
  id: number;
  number: string;
  type: string;
  hotel: string;
  pricePerNight: number;
  capacity: number;
  status: string;
}
// Datos de ejemplo para empezar
export const SAMPLE_ROOMS: Room[] = [];

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied', 
  MAINTENANCE = 'maintenance'
}