import { Hotel } from '@/types/hotel';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 1. OBTENER TODOS LOS HOTELES
export const getHotels = async (): Promise<Hotel[]> => {
  const response = await fetch(`${API_URL}/hotels`);
  if (!response.ok) throw new Error('Error al obtener hoteles');
  return response.json();
};

// 2. OBTENER POR ID
export const getHotelById = async (id: number): Promise<Hotel> => {
  const response = await fetch(`${API_URL}/hotels/${id}`);
  if (!response.ok) throw new Error('Error al obtener los detalles del hotel');
  return response.json();
};

// 3. CREAR HOTEL
export const createHotel = async (hotelData: any) => {
  const token = localStorage.getItem('token');
  
  // Aseguramos que los campos obligatorios no vayan vacíos (Evita error de MySQL)
  const payload = {
    ...hotelData,
    city: hotelData.city || 'Ayacucho', // Valor por defecto preventivo
    stars: Number(hotelData.stars),
    price_per_night: Number(hotelData.price_per_night)
  };

  const response = await fetch(`${API_URL}/hotels`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear el hotel');
  }
  return response.json();
};

// 4. BUSCAR HOTELES (Nuevo)
export const searchHotels = async (city: string = '', name: string = ''): Promise<Hotel[]> => {
  // Construimos la URL con query params: /hotels/search?city=...&name=...
  const response = await fetch(`${API_URL}/hotels/search?city=${city}&name=${name}`);
  if (!response.ok) throw new Error('Error en la búsqueda');
  return response.json();
};

// 5. ACTUALIZAR HOTEL (Nuevo)
export const updateHotel = async (id: number, hotelData: any) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/hotels/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(hotelData),
  });

  if (!response.ok) throw new Error('Error al actualizar el hotel');
  return response.json();
};

// 6. ELIMINAR HOTEL (Nuevo)
export const deleteHotel = async (id: number) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/hotels/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) throw new Error('Error al eliminar el hotel');
  return response.json();
};