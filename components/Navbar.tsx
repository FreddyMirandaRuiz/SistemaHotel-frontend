'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    // 1. Eliminamos el token y datos del usuario
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Si guardaste datos del usuario
    
    // 2. Redirigimos al login
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 px-8 py-4 flex justify-between items-center">
      <div className="flex gap-8 items-center">
        <Link href="/dashboard" className="text-xl font-bold text-blue-600">
          🏨 Hotel App
        </Link>
        <div className="hidden md:flex gap-6 text-gray-600 font-medium">
          <Link href="/dashboard" className="hover:text-blue-600 transition">Catálogo</Link>
          <Link href="/my-bookings" className="hover:text-blue-600 transition">Mis Reservas</Link>
          <Link href="/admin" className="hover:text-blue-600 transition">Admin</Link>
        </div>
      </div>

      <button 
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 py-2 px-4 rounded-xl transition"
      >
        <span>Salir</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </nav>
  );
}