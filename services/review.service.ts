const API_URL = 'http://localhost:3001/reviews';

export const createReview = async (hotelId: number, content: string, rating: number) => {
  const token = localStorage.getItem('token');
  // Validación preventiva
  if (!token) {
    throw new Error('Debes iniciar sesión para publicar una reseña');
  }
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ hotelId, content, rating }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al publicar reseña');
  }

  return response.json();
};