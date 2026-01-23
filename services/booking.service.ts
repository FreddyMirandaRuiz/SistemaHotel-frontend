const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Función auxiliar para obtener y limpiar el token de localStorage.
 * Esto evita el error "jwt malformed" si el token se guardó con comillas.
 */
const getCleanToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  let token = localStorage.getItem('token');
  if (!token) return null;

  // Si el token empieza y termina con comillas (común al usar JSON.stringify), las quitamos
  if (token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1);
  }
  
  return token;
};

// 1. CREAR UNA NUEVA RESERVA
export const createBooking = async (hotelId: number, checkIn: string, checkOut: string) => {
  const token = getCleanToken();

  if (!token) {
    throw new Error('No hay una sesión activa. Por favor, inicia sesión.');
  }

  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      hotelId, 
      checkIn, 
      checkOut 
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      throw new Error('Tu sesión ha expirado. Inicia sesión de nuevo.');
    }
    throw new Error(data.message || 'Error al crear la reserva');
  }

  return data;
};

// 2. OBTENER FECHAS OCUPADAS (Público)
export const getOccupiedDates = async (hotelId: number) => {
  const response = await fetch(`${API_URL}/bookings/occupied/${hotelId}`);
  
  if (!response.ok) {
    throw new Error('Error al obtener fechas ocupadas');
  }
  
  return response.json();
};

// 3. OBTENER RESERVAS DEL USUARIO (Protegido)
export const getMyBookings = async () => {
  const token = getCleanToken();

  if (!token) {
    throw new Error('Debes estar logueado para ver tus reservas');
  }

  const response = await fetch(`${API_URL}/bookings/my-bookings`, {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}` 
    },
  });

  if (!response.ok) {
    if (response.status === 401) localStorage.removeItem('token');
    throw new Error('Error al obtener tus reservas');
  }

  return response.json();
};

// 4. OBTENER UNA RESERVA ESPECÍFICA (Para el resumen de pago)
export const getBookingById = async (bookingId: number) => {
  const token = getCleanToken();
  if (!token) throw new Error('Sesión requerida');

  const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}` 
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'No se pudo cargar la reserva');
  
  return data;
};

// 5. PROCESAR PAGO (Actualizado para recibir datos de tarjeta)
export const processPayment = async (bookingId: number, paymentData: any) => {
  const token = getCleanToken();

  if (!token) {
    throw new Error('Sesión requerida para procesar el pago');
  }

  const response = await fetch(`${API_URL}/payments/${bookingId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    // Enviamos el objeto completo: { name, number, expiry, cvv }
    body: JSON.stringify(paymentData), 
  });

  const data = await response.json();

  if (!response.ok) {
    // Captura los errores del backend (Tarjeta Bloqueada, Vencida, etc.)
    throw new Error(data.message || 'Error al procesar el pago');
  }

  return data;
};

// 6. CANCELAR UNA RESERVA
export const cancelBooking = async (bookingId: number) => {
  const token = getCleanToken();

  if (!token) {
    throw new Error('Sesión requerida para cancelar');
  }

  const response = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
    method: 'PATCH', // Usamos PATCH para actualizar el estado
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'No se pudo cancelar la reserva');
  }

  return data;
};