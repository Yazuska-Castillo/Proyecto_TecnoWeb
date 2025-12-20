export interface Room {
  id: number;
  number: string;
  type: string;
  hotel: string;
  pricePerNight: number | undefined;
  capacity: number;
  status: string;
  description: string;
  images: string[];
}
