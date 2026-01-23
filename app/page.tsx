'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-60 translate-x-1/2 -translate-y-1/2" />
      
      {/* Navegación Simple */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="text-2xl font-black text-slate-900 tracking-tighter">
          HOTEL<span className="text-blue-600">MIRANDA</span>
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/login" className="text-slate-600 font-semibold hover:text-blue-600 transition-colors">
            Iniciar Sesión
          </Link>
          <Link href="/register" className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100">
            Registrarse
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold tracking-wide uppercase">
            🏆 El mejor hotel de la ciudad
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Descubre la magia de <span className="text-blue-600">Hotel Miranda</span> con nosotros.
          </h1>
          <p className="text-slate-500 text-xl leading-relaxed max-w-lg">
            Disfruta de una experiencia de lujo, confort y tradición en el corazón histórico de Lima. Reserva tu estancia hoy mismo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard" className="bg-blue-600 text-white px-8 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 text-center">
              Explorar Hoteles
            </Link>
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <img 
                    key={i} 
                    className="w-10 h-10 rounded-full border-2 border-white object-cover" 
                    src={`https://i.pravatar.cc/150?u=${i + 10}`} 
                    alt="User"
                  />
                ))}
              </div>
              <p className="text-sm font-bold text-slate-600">
                +500 reservas este mes
              </p>
            </div>
          </div>
        </div>

        {/* Lado derecho: IMAGEN REAL REEMPLAZADA */}
        <div className="relative group">
          {/* El contenedor principal de la imagen */}
          <div className="aspect-[4/5] md:aspect-square overflow-hidden rounded-[4rem] shadow-2xl relative">
            <img 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Hotel de Lujo" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            
            {/* Overlay gradiente para que la imagen no se vea plana */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            
            {/* Tarjeta flotante decorativa con Blur */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-white/50 w-[80%] md:max-w-[240px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex gap-0.5 text-amber-400 text-xs">★★★★★</span>
                <span className="text-[10px] font-black text-slate-400">EXCELENCIA</span>
              </div>
              <p className="text-slate-900 font-extrabold leading-tight">Suites de Lujo con las mejores vistas a la cuidad y mar</p>
              <p className="text-blue-600 font-bold text-sm mt-2">Disponibles Ahora →</p>
            </div>
          </div>

          {/* Adorno extra detrás de la imagen */}
          <div className="absolute -bottom-6 -right-6 -z-10 w-full h-full border-2 border-blue-100 rounded-[4.5rem]" />
        </div>
      </main>
    </div>
  );
}