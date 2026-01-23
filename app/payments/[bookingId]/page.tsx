'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
// Importamos las funciones necesarias del servicio que acabas de actualizar
import { processPayment, getBookingById } from '@/services/booking.service';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = Number(params.bookingId);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingAmount, setBookingAmount] = useState<number | null>(null);

  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  });

  // Cargar el monto usando la función nativa del service
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(bookingId);
        setBookingAmount(data.total_price);
      } catch (err: any) {
        console.error("Error al cargar la reserva:", err.message);
        setError("No se pudo cargar la información de la reserva.");
      }
    };
    if (bookingId) fetchBooking();
  }, [bookingId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === 'number') {
      value = value.replace(/\D/g, '').substring(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '); 
    }
    if (name === 'expiry') {
      value = value.replace(/\D/g, '').substring(0, 4);
      if (value.length >= 3) value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (name === 'cvv') value = value.replace(/\D/g, '').substring(0, 3);
    setCardData({ ...cardData, [name]: value });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Preparamos el payload quitando espacios
      const payload = {
        name: cardData.name.trim(),
        number: cardData.number.replace(/\s/g, ''),
        expiry: cardData.expiry,
        cvv: cardData.cvv
      };

      // Llamamos al servicio (que usa fetch internamente)
      const response = await processPayment(bookingId, payload);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => router.push('/my-bookings'), 3000);
      }
    } catch (err: any) {
      // Captura el mensaje de error que configuramos en el Backend
      setError(err.message || 'Error en la pasarela de pago');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-center max-w-sm w-full border border-green-100 animate-in zoom-in duration-300">
          <div className="text-7xl mb-6">✅</div>
          <h1 className="text-3xl font-black text-slate-900">¡Pago Confirmado!</h1>
          <p className="text-slate-500 mt-3 font-medium">Revisa tu correo electrónico para ver tu comprobante.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-[3rem] border border-slate-50">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Finalizar Reserva</h1>
        <p className="text-blue-600 font-bold text-sm bg-blue-50 inline-block px-4 py-1 rounded-full mt-2">
          Reserva #{bookingId} {bookingAmount && `• Total: $${bookingAmount}`}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handlePayment} className="space-y-6">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Nombre en la tarjeta</label>
          <input 
            type="text" required name="name" placeholder="JUAN PEREZ"
            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 text-slate-900 focus:border-blue-500 focus:bg-white outline-none font-bold transition-all"
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Número de tarjeta</label>
          <input 
            type="text" required name="number" value={cardData.number} placeholder="0000 0000 0000 0000"
            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 text-slate-900 focus:border-blue-500 focus:bg-white outline-none font-bold tracking-[0.15em] transition-all"
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Expiración</label>
            <input 
              type="text" required name="expiry" value={cardData.expiry} placeholder="MM / YY"
              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 text-slate-900 focus:border-blue-500 focus:bg-white outline-none font-bold text-center transition-all"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block">CVV</label>
            <input 
              type="text" required name="cvv" value={cardData.cvv} placeholder="000"
              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 text-slate-900 focus:border-blue-500 focus:bg-white outline-none font-bold text-center transition-all"
              onChange={handleInputChange}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-5 rounded-2xl font-black text-white transition-all shadow-xl ${
            loading ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-100'
          }`}
        >
          {loading ? 'Procesando Pago...' : 'Pagar Ahora'}
        </button>
      </form>
    </div>
  );
}