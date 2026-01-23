const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAdminStats = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/bookings/admin/stats`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!response.ok) throw new Error('No se pudieron obtener las estadísticas');
  return response.json();
};

export const getAllBookings = async () => {
  const token = localStorage.getItem('token');
  
  // CAMBIO: La ruta correcta es /bookings/all
  const response = await fetch(`${API_URL}/bookings/all`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  // Si la respuesta no es exitosa (401, 403, 404), lanzamos error
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener todas las reservas');
  }

  const data = await response.json();
  
  // SEGURIDAD: Nos aseguramos de que siempre devuelva un Array
  return Array.isArray(data) ? data : [];
};