export class Reserva {
  constructor(
    public id: number,
    public idCliente: number,
    public idHotel: number,
    public idHabitacion: number,
    public fechaInicio: Date,
    public fechaFin: Date,
    public totalPagar: number,
    public estado: 'activa' | 'cancelada' | 'completada' = 'activa'
  ) {}
}
