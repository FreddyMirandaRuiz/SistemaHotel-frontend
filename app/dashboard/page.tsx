'use client';

import { useEffect, useState } from 'react';
import { getHotels } from '@/services/hotel.service';
import { getContacts } from '@/services/contact.service'; 
import { Hotel } from '@/types/hotel';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Importación dinámica del mapa para evitar errores de hidratación/SSR
const MapDashboard = dynamic(() => import('@/components/MapDashboard'), { 
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-slate-100 animate-pulse rounded-[3rem] flex items-center justify-center text-slate-400 font-bold italic">
      Cargando mapa interactivo...
    </div>
  )
});

export default function DashboardPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState<string>('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0); 
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
        setFilteredHotels(data); // Inicialmente los filtrados son todos
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

  // Lógica del filtro de búsqueda
  useEffect(() => {
    const results = hotels.filter(hotel => 
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredHotels(results);
  }, [searchQuery, hotels]);

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
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 italic uppercase">
              HOTEL<span className="text-blue-600">MIRANDA</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              {userName ? `BIENVENIDO, ${userName}` : 'Luxury Stay Experience'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {userRole === 'admin' && (
              <>
                <Link href="/admin/messages" className="relative bg-white border border-slate-200 p-2.5 rounded-2xl hover:border-blue-500 transition-all flex items-center gap-2 group">
                  <span className="text-lg group-hover:scale-110 transition-transform">📧</span>
                  <span className="hidden md:inline text-[10px] font-black uppercase text-slate-500 tracking-widest">Mensajes</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link href="/admin" className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg hover:bg-blue-600 transition-all">
                  ⚙️ Panel Admin
                </Link>
              </>
            )}
            
            <Link href="/my-bookings" className="bg-white border border-slate-200 px-5 py-2.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest text-slate-700 hover:border-blue-500 transition-all">
              🗓️ Mis Reservas
            </Link>
            <button onClick={handleLogout} className="text-[10px] font-black text-red-500 hover:text-red-700 px-2 uppercase tracking-widest">
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-[1600px] mx-auto px-6 py-10 flex-grow w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* COLUMNA IZQUIERDA: BUSCADOR Y LISTA DE HOTELES */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
               <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic mb-3">Explora Destinos</h2>
               <p className="text-slate-400 font-medium mb-8">Encuentra los mejores hoteles seleccionados para ti.</p>
               
               {/* BARRA DE BÚSQUEDA */}
               <div className="relative">
                 <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl">🔍</span>
                 <input 
                    type="text" 
                    placeholder="Buscar por hotel o ciudad..."
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2rem] p-5 pl-14 outline-none transition-all font-bold text-slate-700 shadow-inner"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-80 bg-white rounded-[3rem] animate-pulse shadow-sm border border-slate-100" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredHotels.length > 0 ? (
                  filteredHotels.map((hotel) => {
                    const avg = getAverageRating(hotel);
                    return (
                      <div key={hotel.id} className="group bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
                        <div className="relative h-60 overflow-hidden">
                          <img 
                            src={hotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            alt={hotel.name}
                          />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-1">
                            <span className="text-amber-500 text-sm">⭐</span>
                            <span className="font-black text-slate-900 text-xs">{avg}</span>
                          </div>
                        </div>
                        <div className="p-8 flex-grow flex flex-col">
                          <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight uppercase italic tracking-tighter italic">{hotel.name}</h3>
                          <p className="text-slate-400 text-[10px] font-black mb-6 uppercase tracking-[0.2em] flex items-center gap-1">📍 {hotel.city}</p>
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
                  })
                ) : (
                  <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-300">
                    <p className="text-5xl mb-4">🚫</p>
                    <p className="text-slate-400 font-black uppercase tracking-widest">No hay resultados para "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: MAPA FIJO */}
          <div className="lg:col-span-5 sticky top-28 h-fit">
            <div className="bg-white p-5 rounded-[3.5rem] shadow-2xl shadow-blue-100/50 border border-slate-100">
              <div className="mb-5 flex justify-between items-center px-4">
                <div>
                  <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest italic">Explora en el Mapa</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Ubicaciones exactas</p>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                </div>
              </div>
              
              <div className="h-[600px] w-full relative overflow-hidden rounded-[2.5rem]">
                <MapDashboard hotels={filteredHotels} />
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="max-w-[1600px] mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h4 className="font-black text-slate-900 uppercase italic text-xl">Hotel Miranda</h4>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Luxury Boutique Experience</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">¿Tienes alguna duda?</p>
            <Link href="/contacto" className="bg-blue-600 text-white px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-100">
              Escríbenos ahora
            </Link>
          </div>
        </div>
        <div className="bg-slate-50 py-6 text-center border-t border-slate-100">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.4em]">© 2026 Hotel Miranda - Ayacucho, Perú</p>
        </div>
      </footer>
    </div>
  );
}