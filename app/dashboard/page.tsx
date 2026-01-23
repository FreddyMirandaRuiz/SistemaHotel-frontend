'use client';

import { useEffect, useState } from 'react';
import { getHotels } from '@/services/hotel.service';
import { getContacts } from '@/services/contact.service'; // <--- Importamos servicio de contactos
import { Hotel } from '@/types/hotel';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0); // <--- Estado para mensajes nuevos
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedName = localStorage.getItem('userName');
    const storedRole = localStorage.getItem('userRole');

    if (!token) {
      router.push('/login');
      return;
    }

    if (storedName) setUserName(storedName);
    if (storedRole) setUserRole(storedRole);

    // Carga de hoteles
    getHotels()
      .then((data) => {
        setHotels(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando hoteles:', err);
        setLoading(false);
        if (err.message?.includes('401')) handleLogout();
      });

    // Carga de mensajes (Solo si es admin)
    if (storedRole === 'admin') {
      getContacts().then(msgs => {
        const unread = msgs.filter((m: any) => !m.is_read).length;
        setUnreadCount(unread);
      }).catch(() => null);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const getAverageRating = (hotel: any) => {
    if (!hotel.reviews || hotel.reviews.length === 0) return hotel.stars;
    const sum = hotel.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0);
    return (sum / hotel.reviews.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* HEADER DINÁMICO */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 italic">
              HOTEL<span className="text-blue-600">MIRANDA</span>
            </h1>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
              {userName ? `Bienvenido, ${userName}` : 'Luxury Stay Experience'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* OPCIONES DE ADMIN */}
            {userRole === 'admin' && (
              <>
                <Link href="/admin/messages" className="relative bg-white border border-slate-200 p-2 rounded-xl hover:border-blue-500 transition-all">
                  📧 Mensajes
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link href="/admin" className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-lg hover:bg-blue-600 transition-all">
                  ⚙️ Panel Admin
                </Link>
              </>
            )}
            
            <Link href="/my-bookings" className="bg-white border border-slate-200 px-4 py-2 rounded-xl font-bold text-xs text-slate-700 hover:border-blue-500 transition-all">
              🗓️ Mis Reservas
            </Link>
            <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:underline px-2">
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-grow">
        <div className="mb-12">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Explora Destinos</h2>
          <p className="text-slate-500 font-medium">Los mejores hoteles seleccionados para ti.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-white rounded-[2.5rem] animate-pulse shadow-sm border border-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {hotels.map((hotel) => {
              const avg = getAverageRating(hotel);
              const totalReviews = hotel.reviews?.length || 0;

              return (
                <div key={hotel.id} className="group bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
                  {/* ... (Todo tu código de renderizado de hotel se mantiene igual) ... */}
                  <div className="relative h-72 overflow-hidden">
                    <img 
                      src={hotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      alt={hotel.name}
                    />
                  </div>
                  <div className="p-8 flex-grow flex flex-col">
                    <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight uppercase italic tracking-tighter italic">{hotel.name}</h3>
                    <p className="text-slate-400 text-xs font-bold mb-6 flex items-center gap-1 uppercase tracking-widest">📍 {hotel.city}</p>
                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block">Desde</span>
                        <span className="text-3xl font-black text-blue-600">${hotel.price_per_night}</span>
                      </div>
                      <Link href={`/hotel/${hotel.id}`} className="bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg hover:rotate-12">➔</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* FOOTER CON CONTACTO */}
      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h4 className="font-black text-slate-900 uppercase">Hotel Miranda</h4>
            <p className="text-slate-400 text-sm">Luxury Boutique Experience</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">¿Necesitas ayuda con tu reserva?</p>
            <Link href="/contacto" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-slate-900 transition-all shadow-xl shadow-blue-100">
              Escríbenos ahora
            </Link>
          </div>
        </div>
        <div className="bg-slate-50 py-4 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">© 2026 Hotel Miranda - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
}