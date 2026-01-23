'use client';

import { useState } from 'react';
import { sendContactMessage } from '@/services/contact.service';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      await sendContactMessage(
        formData.name,
        formData.email,
        formData.subject,
        formData.message
      );
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000); // Resetear estado tras 5 seg
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-slate-100">
          
          {/* LADO IZQUIERDO: Información Estética */}
          <div className="bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-blue-400 font-black uppercase tracking-[0.3em] text-[10px]">Contacto</span>
              <h1 className="text-5xl font-black mt-4 mb-6 leading-tight">Estamos para servirle.</h1>
              <p className="text-slate-400 text-lg leading-relaxed">
                ¿Tiene alguna duda sobre nuestras suites o servicios adicionales? Nuestro equipo está disponible 24/7.
              </p>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">📍</div>
                <p className="text-sm font-medium">Av. Principal 456, Ciudad Turística</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">📞</div>
                <p className="text-sm font-medium">+51 997 648 811</p>
              </div>
            </div>

            {/* Decoración abstracta de fondo */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
          </div>

          {/* LADO DERECHO: Formulario Real */}
          <div className="p-12">
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6">✓</div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">¡Mensaje Recibido!</h3>
                <p className="text-slate-500">Le responderemos a su correo electrónico a la brevedad posible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nombre Completo</label>
                  <input 
                    required
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl p-4 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Email de Contacto</label>
                  <input 
                    required
                    type="email"
                    placeholder="juan@ejemplo.com"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl p-4 outline-none transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Asunto</label>
                  <input 
                    required
                    type="text"
                    placeholder="¿En qué podemos ayudarle?"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl p-4 outline-none transition-all"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Mensaje</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Escriba su consulta aquí..."
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl p-4 outline-none transition-all resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  disabled={status === 'sending'}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {status === 'sending' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Enviando...
                    </>
                  ) : 'Enviar Mensaje'}
                </button>
                
                {status === 'error' && (
                  <p className="text-red-500 text-center text-xs font-bold animate-shake">Error al enviar. Intente de nuevo.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}