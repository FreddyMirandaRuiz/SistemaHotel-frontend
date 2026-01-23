'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getHotelById, updateHotel } from '@/services/hotel.service';
import ImageUploader from '@/components/ImageUploader';

const CIUDADES_PERU = ["Ayacucho", "Cusco", "Lima", "Arequipa", "Puno", "Trujillo", "Iquitos", "Piura", "Tarapoto", "Chiclayo"];

export default function EditHotelPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_per_night: '',
    stars: '5',
    address: '',
    city: '',
    image_url: '',
    images: [] as string[] // Array para las URLs de la galería
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getHotelById(Number(id))
        .then((hotel) => {
          // Extraemos solo las URLs de las imágenes de la galería si vienen como objetos
          const galleryUrls = hotel.images?.map((img: any) => img.url) || [];
          
          setFormData({
            name: hotel.name,
            description: hotel.description,
            price_per_night: hotel.price_per_night.toString(),
            stars: hotel.stars.toString(),
            address: hotel.address,
            city: hotel.city || 'Ayacucho',
            image_url: hotel.image_url || '',
            images: galleryUrls
          });
          setIsLoading(false);
        })
        .catch(() => {
          setError("No se pudo cargar la información del hotel");
          setIsLoading(false);
        });
    }
  }, [id]);

  const handleAddGalleryImage = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }));
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await updateHotel(Number(id), {
        ...formData,
        price_per_night: Number(formData.price_per_night),
        stars: Number(formData.stars),
        // Mapeamos de nuevo a objetos si el backend lo requiere {url: '...'}
        images: formData.images.map(url => ({ url }))
      });
      
      alert('¡Propiedad y galería actualizadas!');
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Error al actualizar");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 italic font-black text-slate-400 uppercase tracking-widest">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-8 md:p-14">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Editar Propiedad</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">ID de Registro: #{id}</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* SECCIÓN DE IMÁGENES */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* PORTADA */}
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block text-center">Foto Principal (Portada)</label>
              <ImageUploader onImageUpload={(url) => setFormData({...formData, image_url: url})} />
              {formData.image_url && (
                <img src={formData.image_url} className="mt-4 w-full h-32 object-cover rounded-xl shadow-sm border-2 border-white" alt="Portada" />
              )}
            </div>

            {/* GALERÍA */}
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block text-center">Añadir a Galería</label>
              <ImageUploader onImageUpload={handleAddGalleryImage} />
              
              <div className="grid grid-cols-4 gap-2 mt-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative group h-16 w-full">
                    <img src={url} className="h-full w-full object-cover rounded-lg border border-slate-200" alt="Galeria" />
                    <button 
                      type="button"
                      onClick={() => handleRemoveGalleryImage(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] font-black shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DATOS GENERALES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Nombre del Hotel</label>
              <input 
                type="text" required
                className="w-full bg-slate-100 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none font-bold"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Ciudad</label>
              <select 
                className="w-full bg-slate-100 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-600 outline-none font-bold appearance-none"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              >
                {CIUDADES_PERU.map(ciudad => <option key={ciudad} value={ciudad}>{ciudad}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Precio Noche ($)</label>
              <input 
                type="number" required
                className="w-full bg-slate-100 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none font-bold"
                value={formData.price_per_night}
                onChange={(e) => setFormData({...formData, price_per_night: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Descripción</label>
            <textarea 
              rows={4} required
              className="w-full bg-slate-100 border-none rounded-[2rem] p-6 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none font-medium resize-none shadow-inner"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6 pt-6 border-t border-slate-50">
            <button 
              type="button" onClick={() => router.push('/admin')}
              className="flex-1 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" disabled={isSaving}
              className="flex-[2] bg-slate-900 text-white font-black py-5 rounded-2xl shadow-2xl hover:bg-blue-600 transition-all disabled:bg-slate-300 uppercase text-[10px] tracking-[0.2em]"
            >
              {isSaving ? 'Guardando...' : 'Actualizar Todo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}