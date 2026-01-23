'use client';
import { useEffect, useState } from 'react';
import { getContacts, markAsRead } from '@/services/contact.service';

export default function ContactDashboard() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<any>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await getContacts();
      setMessages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = async (msg: any) => {
    setSelectedMsg(msg);
    if (!msg.is_read) {
      await markAsRead(msg.id);
      loadMessages(); // Refrescar para quitar el indicador de "Nuevo"
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-400">Cargando mensajes...</div>;

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Bandeja de Entrada</h2>
          <p className="text-slate-500">Gestiona las consultas de tus clientes</p>
        </div>
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-2xl font-bold text-sm">
          {messages.filter(m => !m.is_read).length} Mensajes nuevos
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Estado</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Cliente</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Asunto</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Fecha</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {messages.map((msg) => (
              <tr key={msg.id} className={`hover:bg-blue-50/30 transition-all ${!msg.is_read ? 'bg-blue-50/10' : ''}`}>
                <td className="p-6">
                  {!msg.is_read && <span className="w-3 h-3 bg-blue-600 rounded-full block animate-pulse"></span>}
                </td>
                <td className="p-6">
                  <p className={`font-bold ${!msg.is_read ? 'text-slate-900' : 'text-slate-500'}`}>{msg.name}</p>
                  <p className="text-xs text-slate-400">{msg.email}</p>
                </td>
                <td className="p-6 font-medium text-slate-600">{msg.subject}</td>
                <td className="p-6 text-xs text-slate-400">
                  {new Date(msg.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                </td>
                <td className="p-6 text-right">
                  <button 
                    onClick={() => handleViewMessage(msg)}
                    className="bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
                  >
                    Leer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL SIMPLE PARA LEER EL MENSAJE */}
      {selectedMsg && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] max-w-lg w-full p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Mensaje de Cliente</span>
                <h3 className="text-2xl font-black text-slate-900">{selectedMsg.subject}</h3>
              </div>
              <button onClick={() => setSelectedMsg(null)} className="text-slate-300 hover:text-slate-900 text-2xl">✕</button>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl mb-6">
              <p className="text-slate-600 leading-relaxed italic">"{selectedMsg.message}"</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-400">
                De: <span className="font-bold text-slate-600">{selectedMsg.email}</span>
              </div>
              <a 
                href={`mailto:${selectedMsg.email}?subject=RE: ${selectedMsg.subject}`}
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all"
              >
                Responder por Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}