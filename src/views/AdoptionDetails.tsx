import { ArrowLeft, Heart, MapPin, Phone, Mail, Clock, CalendarCheck } from 'lucide-react';
import type { PetWithImage } from '../types/pet';

interface Props {
  pet: PetWithImage | null;
  onBack: () => void;
}

const shelter = {
  name: 'Refugio Patitas Felices',
  address: '6a Avenida 12-34, Zona 10, Ciudad de Guatemala',
  phone: '+502 2345-6789',
  email: 'adopciones@patitasfelices.gt',
  hours: [
    { day: 'Lunes a Viernes', time: '9:00 – 17:00' },
    { day: 'Sábado',          time: '9:00 – 14:00' },
    { day: 'Domingo',         time: 'Cerrado' },
  ],
};

export default function AdoptionDetails({ pet, onBack }: Props) {
  return (
    <div className="min-h-dvh flex flex-col" data-testid="adoption-details">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button
          aria-label="Volver"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
          onClick={onBack}
        >
          <ArrowLeft size={18} className="text-amber-800" />
        </button>
        <div>
          <h1 className="text-lg font-extrabold text-amber-900 leading-tight">¡Es un match!</h1>
          <p className="text-amber-400 text-xs">Detalles de adopción</p>
        </div>
        <Heart size={20} className="ml-auto text-orange-500" fill="#f97316" />
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-8 space-y-4">
        {/* Pet card */}
        {pet && (
          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="relative h-56">
              {pet.imageUrl ? (
                <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-amber-100 text-6xl">🐶</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-2xl font-extrabold">{pet.name}</h2>
                <p className="text-white/80 text-sm">{pet.breed}</p>
              </div>
            </div>
            <div className="px-5 py-4">
              <p className="text-amber-700 text-sm leading-relaxed whitespace-pre-line">{pet.bio}</p>
            </div>
          </div>
        )}

        {/* Shelter info */}
        <div className="glass-card rounded-3xl p-5 space-y-4">
          <h3 className="font-extrabold text-amber-900 text-base">{shelter.name}</h3>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
              <MapPin size={16} className="text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-amber-400 font-semibold uppercase tracking-wide mb-0.5">Dirección</p>
              <p className="text-amber-800 text-sm font-medium">{shelter.address}</p>
            </div>
          </div>

          <a href={`tel:${shelter.phone}`} className="flex items-start gap-3 group">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
              <Phone size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-amber-400 font-semibold uppercase tracking-wide mb-0.5">Teléfono</p>
              <p className="text-amber-800 text-sm font-medium group-hover:text-green-600 transition-colors">{shelter.phone}</p>
            </div>
          </a>

          <a href={`mailto:${shelter.email}`} className="flex items-start gap-3 group">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <Mail size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-amber-400 font-semibold uppercase tracking-wide mb-0.5">Correo electrónico</p>
              <p className="text-amber-800 text-sm font-medium group-hover:text-blue-600 transition-colors">{shelter.email}</p>
            </div>
          </a>
        </div>

        {/* Visiting hours */}
        <div className="glass-card rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-orange-500" />
            <h3 className="font-extrabold text-amber-900 text-base">Horarios de visita</h3>
          </div>
          <ul className="space-y-2">
            {shelter.hours.map((h) => (
              <li key={h.day} className="flex justify-between items-center text-sm">
                <span className="text-amber-600 font-medium">{h.day}</span>
                <span className={`font-bold ${h.time === 'Cerrado' ? 'text-red-400' : 'text-amber-900'}`}>
                  {h.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* CTA footer */}
      <footer className="pb-5 px-5 pt-3 space-y-3">
        <button
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-base shadow-lg hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] transition-all"
          onClick={() => window.open(`tel:${shelter.phone}`)}
        >
          <CalendarCheck size={20} />
          Agendar visita
        </button>
        <button
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/70 border border-amber-200 text-amber-700 font-bold text-sm hover:bg-white active:scale-[0.98] transition-all"
          onClick={onBack}
        >
          Seguir explorando
        </button>
      </footer>
    </div>
  );
}
