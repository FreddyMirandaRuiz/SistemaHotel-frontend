'use client';

import { useEffect, useState, useCallback } from 'react'; // Agregamos useCallback
import { useParams, useRouter } from 'next/navigation';
import { getOccupiedDates, createBooking } from '@/services/booking.service';
import { getHotelById } from '@/services/hotel.service';
import ReviewForm from '@/components/ReviewForm'; // <-- Importamos el formulario

export default function HotelDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [hotel, setHotel] = useState<any>(null);
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  const [occupied, setOccupied] = useState<{ from: string; to: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  // Función para cargar datos (la envolvemos en useCallback para poder re-usarla)
  const loadData = useCallback(async () => {
    try {
      const [hotelData, occupiedData] = await Promise.all([
        getHotelById(Number(id)),
        getOccupiedDates(Number(id))
      ]);
      setHotel(hotelData);
      setOccupied(occupiedData);
      // Solo seteamos la imagen inicial la primera vez que carga
      if (!activeImage) setActiveImage(hotelData.image_url);
    } catch (error) {
      console.error("Error cargando detalles:", error);
    } finally {
      setLoading(false);
    }
  }, [id, activeImage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBooking = async () => {
    if (!dates.checkIn || !dates.checkOut) {
      alert("Por favor selecciona ambas fechas");
      return;
    }
    // Validación básica: checkOut debe ser posterior a checkIn
    if (new Date(dates.checkIn) >= new Date(dates.checkOut)) {
      alert("La fecha de salida debe ser posterior a la de entrada");
      return;
    }

    try {
      await createBooking(Number(id), dates.checkIn, dates.checkOut);
      alert('¡Reserva creada con éxito!');
      router.push('/my-bookings'); // Mejor redirigir a sus reservas
    } catch (error: any) {
      alert(error.response?.data?.message || "Error al reservar");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black text-slate-400 text-2xl">Preparando tu estancia...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* SECCIÓN SUPERIOR: GALERÍA E INFO RÁPIDA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative h-[500px] w-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white group">
            <img 
              src={activeImage} 
              alt="Preview" 
              className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
            />
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
              <span className="text-amber-500 font-bold">★ {hotel?.stars} Estrellas</span>
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setActiveImage(hotel.image_url)}
              className={`w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-4 transition-all ${activeImage === hotel.image_url ? 'border-blue-600 scale-90' : 'border-transparent opacity-70'}`}
            >
              <img src={hotel.image_url} className="w-full h-full object-cover" />
            </button>
            {hotel?.images?.map((img: any) => (
              <button 
                key={img.id}
                onClick={() => setActiveImage(img.url)}
                className={`w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-4 transition-all ${activeImage === img.url ? 'border-blue-600 scale-90' : 'border-transparent opacity-70'}`}
              >
                <img src={img.url} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col justify-between">
          <div>
            <h1 className="text-5xl font-black text-slate-900 leading-tight mb-2 tracking-tighter">{hotel?.name}</h1>
            <p className="text-slate-400 flex items-center gap-2 mb-8 text-lg">📍 {hotel?.city}, {hotel?.address}</p>
            
            <div className="flex items-baseline gap-2 mb-10">
              <span className="text-6xl font-black text-blue-600">${hotel?.price_per_night}</span>
              <span className="text-slate-400 font-bold">/ noche</span>
            </div>

            <div className="space-y-4 bg-slate-50 p-6 rounded-[2rem]">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Llegada</label>
                  <input type="date" className="w-full bg-white border-none rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-600 outline-none" onChange={(e) => setDates({ ...dates, checkIn: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Salida</label>
                  <input type="date" className="w-full bg-white border-none rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-600 outline-none" onChange={(e) => setDates({ ...dates, checkOut: e.target.value })} />
                </div>
              </div>
              <button onClick={handleBooking} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-600 transition-all shadow-xl shadow-blue-100">
                Reservar Ahora
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: TABS */}
      <div className="bg-white rounded-[3rem] shadow-xl border border-slate-50 overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          {[
            { id: 'info', label: 'Sobre el Hotel', icon: '🏨' },
            { id: 'reviews', label: `Reseñas (${hotel?.reviews?.length || 0})`, icon: '💬' },
            { id: 'calendar', label: 'Disponibilidad', icon: '📅' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-6 font-bold flex items-center justify-center gap-2 transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-inner' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        <div className="p-10">
          {activeTab === 'info' && (
            <div className="animate-in fade-in duration-500">
              <h3 className="text-2xl font-bold mb-4">Descripción de la propiedad</h3>
              <p className="text-slate-600 leading-relaxed text-lg max-w-4xl whitespace-pre-line">{hotel?.description}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-10 animate-in fade-in duration-500">
              {/* INSERTAMOS EL FORMULARIO AQUÍ */}
              <ReviewForm hotelId={Number(id)} onReviewSuccess={loadData} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hotel?.reviews?.length > 0 ? hotel.reviews.map((rev: any) => (
                  <div key={rev.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-md">
                          {rev.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                        <p className="font-bold text-slate-900 leading-none mb-1">
                          {/* Combinamos nombre y apellido. Si no existen, mostramos 'Viajero' */}
                          {rev.user?.first_name 
                            ? `${rev.user.first_name} ${rev.user.last_name || ''}` 
                            : 'Viajero'}
                        </p>

                        {/* FECHA DE LA RESEÑA (Usando createdAt) */}
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {rev.createdAt 
                            ? new Date(rev.createdAt).toLocaleDateString('es-ES', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              }) 
                            : 'Reciente'}
                        </p>

                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                          Reseña Verificada
                        </p>
                        </div>
                      </div>
                      <div className="flex text-amber-400 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                        {"★".repeat(rev.rating)}
                      </div>
                    </div>
                    <p className="text-slate-600 italic leading-relaxed">"{rev.content}"</p>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <span className="text-4xl mb-2 block">⭐</span>
                    <p className="text-slate-400 font-black">Sé el primero en compartir tu experiencia</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
               {occupied.length > 0 ? occupied.map((range, index) => (
                <div key={index} className="p-6 bg-red-50 rounded-3xl border border-red-100 flex flex-col items-center text-center">
                  <span className="text-2xl mb-1">🚫</span>
                  <p className="text-red-700 font-black text-xs uppercase tracking-widest mb-2">No disponible</p>
                  <p className="text-red-900 font-bold text-sm">
                    {new Date(range.from).toLocaleDateString()} - {new Date(range.to).toLocaleDateString()}
                  </p>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center bg-green-50 rounded-[2rem] border-2 border-dashed border-green-200">
                   <span className="text-4xl mb-2 block">✅</span>
                   <p className="text-green-700 font-black text-lg">¡Total disponibilidad este mes!</p>
                   <p className="text-green-600/60">Elige tus fechas y reserva ahora.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}