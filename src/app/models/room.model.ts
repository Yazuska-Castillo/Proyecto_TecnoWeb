// Si quieres, puedes dejar el enum para el futuro,
// pero ahora mismo NO lo vamos a usar para no romper todo.
export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied', 
  MAINTENANCE = 'maintenance'
}

// Modelo de habitación compatible con el resto del código actual
export interface Room {
  id: number;
  number: string;
  type: string;
  hotel: string;          // ← volvemos a usar el nombre del hotel
  pricePerNight: number;
  capacity: number;
  status: string;         // ← volvemos a usar 'Disponible', 'Ocupada', etc.
}
