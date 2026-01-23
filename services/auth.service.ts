// 1. Asegúrate de tener NEXT_PUBLIC_API_URL=http://localhost:3001 en tu archivo .env.local
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    // 2. Mejoramos el manejo de errores para capturar el mensaje real del Backend
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Credenciales incorrectas');
    }

    // 3. Retorna { access_token, user: { id, first_name, email } }
    return await response.json(); 
  } catch (error: any) {
    // Re-lanzamos el error para que el componente LoginPage lo capture en el catch
    throw new Error(error.message || 'Error de conexión con el servidor');
  }
};

/**
 * Agregamos el registro para mantener la consistencia
 */
export const register = async (userData: any) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al crear la cuenta');
  }

  return await response.json();
};