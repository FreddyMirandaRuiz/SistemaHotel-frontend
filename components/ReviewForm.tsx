'use client';
import { useState } from 'react';
import { createReview } from '@/services/review.service';

interface ReviewFormProps {
  hotelId: number;
  onReviewSuccess: () => void;
}

export default function ReviewForm({ hotelId, onReviewSuccess }: ReviewFormProps) {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación de seguridad: Verificar token antes de enviar
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Debes iniciar sesión para dejar una reseña.");
      return;
    }

    if (!content.trim() || content.length < 10) {
      alert("Por favor, escribe un comentario un poco más detallado (mín. 10 caracteres).");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview(hotelId, content, rating);
      
      // Limpiar formulario tras éxito
      setContent('');
      setRating(5);
      
      alert("¡Gracias! Tu reseña ha sido publicada.");
      onReviewSuccess(); // Esto refresca la lista en el componente padre
    } catch (error: any) {
      // Ajuste para fetch nativo: usamos error.message directamente
      alert(error.message || "No se pudo publicar la reseña. Inténtalo más tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-md"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <span className="bg-blue-100 p-2 rounded-xl text-lg">✍️</span> 
          Cuéntanos tu experiencia
        </h3>
        <p className="text-slate-500 text-sm mt-1 ml-12">Tu opinión ayuda a otros viajeros a elegir mejor.</p>
      </div>

      {/* SISTEMA DE ESTRELLAS INTERACTIVO */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 ml-1">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Calificación</span>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`text-3xl transition-transform duration-150 active:scale-90 ${
                (hover || rating) >= star ? 'text-amber-400' : 'text-slate-200'
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </button>
          ))}
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-xs font-black self-start sm:self-center">
          {rating === 5 ? '¡Excelente!' : rating === 4 ? 'Muy bueno' : rating === 3 ? 'Bueno' : 'Regular'}
        </div>
      </div>

      {/* ÁREA DE TEXTO */}
      <div className="group space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Tu comentario</label>
        <textarea
          required
          className="w-full bg-slate-50 p-6 rounded-[2rem] border-2 border-transparent focus:border-blue-500/20 focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none text-slate-700 min-h-[150px] transition-all resize-none shadow-inner"
          placeholder="¿Qué fue lo que más te gustó? ¿Cómo fue el trato del personal?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto bg-slate-900 text-white px-12 py-4 rounded-[1.5rem] font-bold hover:bg-blue-600 active:scale-95 transition-all shadow-xl shadow-slate-200 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Publicando...
            </>
          ) : (
            'Publicar Reseña'
          )}
        </button>
      </div>
    </form>
  );
}