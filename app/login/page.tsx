'use client';
import { useState } from 'react';
import { login } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const data = await login(email, password);
      
      // Extraemos el token y los datos del usuario que devuelve el backend
      const token = data.access_token || data.token;
      
      if (token) {
        // 1. Guardamos el Token para las peticiones API
        localStorage.setItem('token', token);
        
        // 2. GUARDAMOS EL ROL Y EL NOMBRE (Vital para el Dashboard)
        // Usamos data.user porque es la estructura que definimos en el AuthService de NestJS
        if (data.user) {
          localStorage.setItem('userRole', data.user.role); // 'admin' o 'customer'
          localStorage.setItem('userName', data.user.first_name);
        }

        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Error al entrar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] -z-10"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-[100px] -z-10"></div>

      <div className="w-full max-w-[450px]">
        <div className="bg-white rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-slate-100 p-10 md:p-14">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 
            rounded-3xl flex items-center justify-center text-white text-xl font-black
            shadow-xl shadow-blue-200 mx-auto mb-6">
              🏨HMR
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bienvenido</h1>
            <p className="text-slate-400 mt-2 font-medium">Inicia sesión en Hotel Miranda Ruiz</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 animate-shake text-center">
                {error}
              </div>
            )}

            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Correo Electrónico</label>
              <input 
                type="email" 
                required
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all outline-none placeholder:text-slate-300 font-medium"
                placeholder="nombre@correo.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Contraseña</label>
              <input 
                type="password" 
                required
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all outline-none placeholder:text-slate-300 font-medium"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98] mt-4"
            >
              {isLoading ? (
                 <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  Verificando...
                 </span>
                 ) : (
                'Entrar al Sistema')}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-400 text-sm font-medium">
              ¿No tienes cuenta? <a href="/register" className="text-blue-600 font-bold hover:underline">Regístrate</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}