'use client';

import { useEffect, useState } from 'react';
import { getHotels } from '@/services/hotel.service';
import { Hotel } from '@/types/hotel';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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
  }, [router]);

  const handleLogout = () => {
    localStorage.clear(); // Limpia todo de una vez
    router.push('/login');
  };

  // Función interna para calcular el rating promedio
  const getAverageRating = (hotel: any) => {
    if (!hotel.reviews || hotel.reviews.length === 0) return hotel.stars;
    const sum = hotel.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0);
    return (sum / hotel.reviews.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
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
            {userRole === 'admin' && (
              <Link href="/admin" className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-lg hover:bg-blue-600 transition-all">
                ⚙️ Admin
              </Link>
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
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Explora Lima</h2>
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
                  {/* IMAGEN */}
                  <div className="relative h-72 overflow-hidden">
                    <img 
                      src={hotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      alt={hotel.name}
                    />
                    
                    {/* Badge de Popularidad */}
                    {Number(avg) >= 4.5 && (
                      <div className="absolute top-5 left-5 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-tighter">
                        🔥 Popular
                      </div>
                    )}

                    {/* Overlay de Rating */}
                    <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                      <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/20">
                        <div className="flex items-center gap-1 text-amber-500 font-black text-sm">
                          ⭐ {avg} <span className="text-slate-400 text-[10px] font-bold">({totalReviews})</span>
                        </div>
                      </div>
                      <div className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/10 uppercase">
                        {hotel.city || 'Ayacucho'}
                      </div>
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="p-8 flex-grow flex flex-col">
                    <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight uppercase italic tracking-tighter italic">
                      {hotel.name}
                    </h3>
                    <p className="text-slate-400 text-xs font-bold mb-6 flex items-center gap-1 uppercase tracking-widest">
                      📍 {hotel.address || 'Centro Histórico'}
                    </p>

                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block">Desde</span>
                        <span className="text-3xl font-black text-blue-600">${hotel.price_per_night}</span>
                      </div>
                      <Link
                        href={`/hotel/${hotel.id}`}
                        className="bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg hover:rotate-12"
                      >
                        ➔
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}