export interface Hotel {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  stars: number;
  price_per_night: string; // El backend lo envía como string por el tipo DECIMAL
}