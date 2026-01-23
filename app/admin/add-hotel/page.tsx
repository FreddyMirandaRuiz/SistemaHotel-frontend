'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';

// Listado de ciudades populares
const CIUDADES_PERU = [
  "Ayacucho", "Cusco", "Lima", "Arequipa", "Puno", 
  "Trujillo", "Iquitos", "Piura", "Tarapoto", "Chiclayo"
];

export default function AddHotelPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_per_night: '',
    stars: '5',
    address: '',
    city: 'Ayacucho', // Ciudad por defecto
    image_url: '',
    images: [] as string[]
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGalleryUpload = (url: string) => {
    setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      setError('Sube la foto principal para continuar.');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/hotels', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...formData,
          price_per_night: Number(formData.price_per_night),
          stars: Number(formData.stars),
          images: formData.images.map(url => ({ url })) 
        }),
      });

      if (!response.ok) throw new Error('Error al crear el hotel.');
      router.push('/admin'); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl p-8 md:p-14 border border-slate-100">
        <header className="mb-12">
          <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] block mb-2">Panel de Administración</span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Nueva Propiedad</h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* SECCIÓN DE IMÁGENES */}
          <section className="grid md:grid-cols-2 gap-10 bg-slate-50 p-8 rounded-[2rem]">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Imagen de Portada</label>
              <ImageUploader onImageUpload={(url) => setFormData({...formData, image_url: url})} />
              {formData.image_url && <p className="text-green-600 text-[10px] font-bold uppercase tracking-tighter">✓ Portada cargada</p>}
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Galería de Fotos ({formData.images.length})</label>
              <ImageUploader onImageUpload={handleGalleryUpload} />
              <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                {formData.images.map((img, i) => (
                  <img key={i} src={img} className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-md" alt="Galeria" />
                ))}
              </div>
            </div>
          </section>

          {/* DATOS DEL HOTEL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="md:col-span-2">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Nombre Comercial</label>
               <input 
                type="text" required 
                className="w-full bg-white border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all shadow-sm" 
                placeholder="Ej. Miranda Ruiz Luxury Hotel"
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
               />
             </div>

             {/* SELECTOR DE CIUDAD */}
             <div>
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Ciudad (Destino)</label>
               <select 
                className="w-full bg-slate-100 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold cursor-pointer appearance-none"
                value={formData.city} 
                onChange={(e) => setFormData({...formData, city: e.target.value})}
               >
                 {CIUDADES_PERU.map(ciudad => (
                   <option key={ciudad} value={ciudad}>{ciudad}</option>
                 ))}
                 <option value="Otra">Otra...</option>
               </select>
             </div>

             <div>
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Dirección Específica</label>
               <input 
                type="text" required 
                className="w-full bg-slate-100 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold" 
                placeholder="Ej. Jr. 28 de Julio 123"
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})} 
               />
             </div>

             <div>
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Tarifa por Noche ($)</label>
               <input 
                type="number" required 
                className="w-full bg-slate-100 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-600" 
                placeholder="150"
                value={formData.price_per_night} 
                onChange={(e) => setFormData({...formData, price_per_night: e.target.value})} 
               />
             </div>

             <div>
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Estrellas</label>
               <select 
                className="w-full bg-slate-100 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold appearance-none cursor-pointer"
                value={formData.stars} 
                onChange={(e) => setFormData({...formData, stars: e.target.value})}
               >
                 {[5, 4, 3, 2, 1].map(n => (
                   <option key={n} value={n}>{"⭐".repeat(n)} {n} Estrellas</option>
                 ))}
               </select>
             </div>
          </div>

          <div>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Descripción del establecimiento</label>
            <textarea 
              rows={4} required 
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-[2rem] p-6 focus:bg-white focus:border-blue-500 outline-none resize-none font-medium transition-all" 
              placeholder="Detalla los servicios como WiFi, Desayuno, Piscina..."
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6 pt-6">
            <button 
              type="button" 
              onClick={() => router.push('/admin')} 
              className="flex-1 text-slate-400 font-bold hover:text-slate-900 transition-colors uppercase text-xs tracking-widest"
            >
              ← Cancelar y Volver
            </button>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="flex-[2] bg-slate-900 text-white font-black py-5 rounded-[1.5rem] hover:bg-blue-600 transition-all shadow-2xl shadow-blue-100 disabled:bg-slate-300 uppercase text-xs tracking-[0.2em]"
            >
              {isLoading ? 'Publicando...' : 'Guardar Hotel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}