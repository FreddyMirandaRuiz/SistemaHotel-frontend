'use client';
import { useState } from 'react';

interface Props {
  onImageUpload: (url: string) => void;
}

export default function ImageUploader({ onImageUpload }: Props) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vista previa local para que el usuario vea qué eligió
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'hotel_preset'); // El nombre que creamos en el paso anterior

    try {
      // Usamos tu Cloud Name: dqoqwflu8
      const res = await fetch('https://api.cloudinary.com/v1_1/dqoqwflu8/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (data.secure_url) {
        onImageUpload(data.secure_url); // Le pasamos la URL final al formulario principal
      }
    } catch (error) {
      console.error('Error al subir:', error);
      alert('Error al conectar con Cloudinary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative border-2 border-dashed border-slate-300 rounded-3xl p-6 bg-slate-50 hover:bg-white hover:border-blue-400 transition-all text-center">
      {preview ? (
        <div className="relative">
          <img src={preview} alt="Vista previa" className="h-56 w-full object-cover rounded-2xl shadow-md" />
          {loading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-2xl">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-10">
          <span className="text-5xl">📷</span>
          <p className="mt-4 text-slate-600 font-semibold">Seleccionar foto real desde mi computadora</p>
          <p className="text-xs text-slate-400">JPG, PNG o WEBP</p>
        </div>
      )}

      <input 
        type="file" 
        accept="image/*"
        onChange={handleUpload}
        className="absolute inset-0 opacity-0 cursor-pointer"
        disabled={loading}
      />
    </div>
  );
}