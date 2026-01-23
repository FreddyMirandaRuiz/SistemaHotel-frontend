'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Usamos la variable de entorno o el localhost por defecto
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // AJUSTE: Mapeamos los nombres de campos para que coincidan con los argumentos del AuthService
        body: JSON.stringify({
          firstName: formData.name, // El backend espera firstName
          email: formData.email,
          pass: formData.password   // El backend espera pass
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar usuario');
      }

      alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
      router.push('/login');
      
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      {/* ... (Toda tu estructura de UI se mantiene igual, está excelente) ... */}
      <div className="w-full max-w-[500px]">
        <div className="bg-white rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-slate-100 p-10 md:p-14">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-3xl shadow-xl shadow-blue-200 mx-auto mb-6">
              🏨
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Crear Cuenta</h1>
            <p className="text-slate-400 mt-2 font-medium">Únete a Miranda Plaza hoy</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 text-center animate-bounce">
                {error}
              </div>
            )}

            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Nombre Completo</label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all outline-none font-medium placeholder:text-slate-300"
                placeholder="Ej. Juan Pérez"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Correo Electrónico</label>
              <input 
                type="email" 
                required
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all outline-none font-medium placeholder:text-slate-300"
                placeholder="nombre@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Contraseña</label>
              <input 
                type="password" 
                required
                minLength={6}
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all outline-none font-medium placeholder:text-slate-300"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-blue-600 disabled:bg-slate-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98] mt-4"
            >
              {isLoading ? 'Creando cuenta...' : 'Registrarse ahora'}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-slate-50 pt-8">
            <p className="text-slate-400 text-sm font-medium">
              ¿Ya tienes cuenta? <a href="/login" className="text-blue-600 font-bold hover:underline">Inicia Sesión</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}