'use client';
import { useEffect, useState } from 'react';
import { getContacts, markAsRead } from '@/services/contact.service';
import Link from 'next/link';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<any>(null);

  const loadMessages = async () => {
    try {
      const data = await getContacts();
      setMessages(data);
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleViewMessage = async (msg: any) => {
    setSelectedMsg(msg);
    if (!msg.is_read) {
      await markAsRead(msg.id);
      loadMessages(); 
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* BOTÓN REGRESAR */}
        <Link href="/dashboard" className="text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-6 transition-all">
           ← Volver al Dashboard
        </Link>

        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Bandeja de Mensajes</h1>
          <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase">
            {messages.filter(m => !m.is_read).length} Nuevos
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-xl">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-slate-400 font-bold uppercase tracking-widest">No hay mensajes aún</p>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em]">Estado</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em]">Remitente</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em]">Asunto</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em]">Fecha</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messages.map((msg) => (
                  <tr key={msg.id} className={`hover:bg-blue-50/50 transition-colors ${!msg.is_read ? 'bg-blue-50/20' : ''}`}>
                    <td className="p-6">
                      {!msg.is_read && <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>}
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-slate-900">{msg.name}</p>
                      <p className="text-xs text-slate-400">{msg.email}</p>
                    </td>
                    <td className="p-6 font-medium text-slate-600">{msg.subject}</td>
                    <td className="p-6 text-xs text-slate-400">
                       {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-6 text-center">
                      <button 
                        onClick={() => handleViewMessage(msg)}
                        className="bg-slate-100 hover:bg-slate-900 hover:text-white px-4 py-2 rounded-xl text-xs font-black transition-all"
                      >
                        LEER
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL PARA LEER EL MENSAJE */}
      {selectedMsg && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] max-w-lg w-full p-10 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="flex justify-between items-start mb-6 border-b border-slate-50 pb-6">
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Consulta Recibida</span>
                <h3 className="text-2xl font-black text-slate-900">{selectedMsg.subject}</h3>
              </div>
              <button onClick={() => setSelectedMsg(null)} className="text-slate-300 hover:text-red-500 text-2xl transition-colors">✕</button>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl mb-8">
              <p className="text-slate-600 leading-relaxed italic text-lg font-medium">"{selectedMsg.message}"</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">De: <span className="text-slate-900 font-bold">{selectedMsg.email}</span></p>
              <button onClick={() => setSelectedMsg(null)} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}