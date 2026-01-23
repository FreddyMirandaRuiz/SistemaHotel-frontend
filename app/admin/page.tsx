'use client';
import { useEffect, useState } from 'react';
import { getAdminStats, getAllBookings } from '@/services/admin.service';
import { getHotels, deleteHotel, searchHotels } from '@/services/hotel.service';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Protección de Ruta
    const role = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    if (!token || role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    // 2. Carga inicial de datos: Reportes + Reservas + Inventario
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsData, bookingsData, hotelsData] = await Promise.all([
        getAdminStats(),
        getAllBookings(),
        getHotels()
      ]);
      setStats(statsData);
      setBookings(bookingsData);
      setHotels(hotelsData);
    } catch (err) {
      console.error("Error cargando dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Lógica de Búsqueda de Hoteles
  const handleSearchHotels = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const results = await searchHotels('', searchTerm);
      setHotels(results);
    } catch (error) {
      console.error("Error en búsqueda:", error);
    }
  };

  // Lógica de Eliminación de Hotel
  const handleDeleteHotel = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este hotel? Esta acción no se puede deshacer.')) {
      try {
        await deleteHotel(id);
        setHotels(hotels.filter(h => h.id !== id));
        alert('Hotel eliminado con éxito');
      } catch (error) {
        alert('Error al eliminar el hotel');
      }
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Sincronizando datos maestros...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* CABECERA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Panel Administrativo</h1>
            <p className="text-gray-500 font-medium">Gestión global de ingresos e inventario</p>
          </div>
          
          <div className="flex gap-3">
            <Link 
              href="/dashboard" 
              className="bg-white text-gray-600 px-6 py-3 rounded-2xl font-bold border border-gray-200 hover:bg-gray-50 transition shadow-sm"
            >
              Vista Cliente
            </Link>
            <Link 
              href="/admin/add-hotel" 
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
            >
              + Nuevo Hotel
            </Link>
          </div>
        </div>

        {/* TARJETAS DE MÉTRICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Ingresos Recaudados</p>
            <h2 className="text-4xl font-black text-green-600">${stats?.revenue?.total_collected || 0}</h2>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Ingresos Potenciales</p>
            <h2 className="text-4xl font-black text-blue-600">${stats?.revenue?.total_potential || 0}</h2>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Reservas</p>
            <h2 className="text-4xl font-black text-purple-600">{stats?.counts?.total_reservations || 0}</h2>
          </div>
        </div>

        {/* SECCIÓN 1: GESTIÓN DE INVENTARIO (Hoteles) */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-10">
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="font-black text-xl text-gray-800 tracking-tight">Gestión de Hoteles</h3>
            <form onSubmit={handleSearchHotels} className="flex gap-2 w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Buscar hotel por nombre..."
                className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider">
                Buscar
              </button>
            </form>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="p-6">Información Sede</th>
                  <th className="p-6">Ubicación</th>
                  <th className="p-6">Precio/Noche</th>
                  <th className="p-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {hotels.map((hotel: any) => (
                  <tr key={hotel.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="font-bold text-gray-900">{hotel.name}</div>
                      <div className="text-xs text-gray-400">{hotel.stars} Estrellas</div>
                    </td>
                    <td className="p-6 text-gray-600 font-medium">{hotel.city}</td>
                    <td className="p-6 font-black text-indigo-600">${hotel.price_per_night}</td>
                    <td className="p-6">
                      <div className="flex justify-center gap-2">
                        <Link 
                          href={`/admin/hotels/edit/${hotel.id}`}
                          className="bg-amber-100 text-amber-600 p-2.5 rounded-xl hover:bg-amber-200 transition"
                        >
                          ✏️
                        </Link>
                        <button 
                          onClick={() => handleDeleteHotel(hotel.id)}
                          className="bg-red-100 text-red-500 p-2.5 rounded-xl hover:bg-red-200 transition"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECCIÓN 2: HISTORIAL DE RESERVAS */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center text-gray-800">
            <h3 className="font-black text-xl">Reservas del Sistema</h3>
            <span className="bg-gray-100 text-gray-500 px-4 py-1 rounded-full text-[10px] font-black uppercase">
              {bookings.length} Transacciones
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="p-6">Cliente</th>
                  <th className="p-6">Hotel Reservado</th>
                  <th className="p-6">Total Pago</th>
                  <th className="p-6 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-6">
                      <div className="font-bold text-gray-900">{b.user?.first_name || 'Usuario'}</div>
                      <div className="text-xs text-gray-400">{b.user?.email}</div>
                    </td>
                    <td className="p-6 font-medium text-gray-700">{b.hotel?.name}</td>
                    <td className="p-6 font-black text-indigo-600">${b.total_price}</td>
                    <td className="p-6 text-center">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight ${
                        b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}