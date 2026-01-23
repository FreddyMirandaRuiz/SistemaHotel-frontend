'use client';

import { useEffect, useState } from 'react';
import { getMyBookings, cancelBooking } from '@/services/booking.service'; // Importamos la función de cancelación
import Link from 'next/link';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar los datos (la movemos fuera para poder reutilizarla al cancelar)
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getMyBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Función para manejar la cancelación
  const handleCancel = async (id: number) => {
    const confirmCancel = confirm('¿Estás seguro de que deseas cancelar esta reserva?');
    if (!confirmCancel) return;

    try {
      await cancelBooking(id);
      alert('Reserva cancelada con éxito');
      // Recargamos las reservas para mostrar el nuevo estado
      await fetchBookings();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-lg font-semibold text-blue-600 animate-pulse">
          Cargando tus reservas...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-500 font-semibold">
        Error: {error}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Título */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-800">Mis Reservas</h1>
        <p className="text-slate-500 mt-1">Revisa el estado de tus próximas estancias</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">🏨</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Aún no tienes reservas</h2>
          <p className="text-gray-500 mb-6">Encuentra el hotel perfecto para tu próxima estadía</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Explorar hoteles
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Info hotel */}
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {booking.hotel?.name || 'Hotel'}
                  </h2>
                  <div className="flex flex-wrap gap-6 mt-3 text-sm text-slate-600">
                    <span>
                      📅 Entrada: <b>{new Date(booking.check_in).toLocaleDateString()}</b>
                    </span>
                    <span>
                      📅 Salida: <b>{new Date(booking.check_out).toLocaleDateString()}</b>
                    </span>
                  </div>
                  <div className="mt-4 text-lg font-extrabold text-green-600">
                    Total: ${booking.total_price}
                  </div>
                </div>

                {/* Estado + acciones */}
                <div className="flex flex-col items-end gap-3">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide
                      ${
                        booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : booking.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {booking.status === 'pending' ? 'Pendiente' : 
                     booking.status === 'paid' ? 'Pagado' : 'Cancelado'}
                  </span>

                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    {/* Botón pagar */}
                    {booking.status === 'pending' && (
                      <Link
                        href={`/payments/${booking.id}`}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all text-center"
                      >
                        Pagar ahora
                      </Link>
                    )}

                    {/* Botón cancelar: solo disponible si no está ya cancelada */}
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-bold transition-colors py-2 px-4 border border-transparent hover:border-red-200 rounded-full"
                      >
                        Cancelar Reserva
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}