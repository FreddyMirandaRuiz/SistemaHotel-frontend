// services/contact.service.ts

const API_URL = 'http://localhost:3001/contacts';

// Esta es la que ya tenías para el formulario público
export const sendContactMessage = async (name: string, email: string, subject: string, message: string) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, subject, message }),
  });

  if (!response.ok) throw new Error('Error al enviar el mensaje');
  return response.json();
};

// ESTA ES LA QUE FALTA (Para el Dashboard del Admin)
export const getContacts = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) throw new Error('No se pudieron cargar los contactos');
  return response.json();
};

// También agrega esta para poder marcar como leído después
export const markAsRead = async (id: number) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/${id}/read`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};