import { Heart, RefreshCw, AlertCircle } from 'lucide-react';
import PetCard from '../components/PetCard';
import { usePets } from '../hooks/usePets';
import type { PetWithImage } from '../types/pet';

interface Props {
  onLike: (pet: PetWithImage) => void;
}

export default function SwipeView({ onLike }: Props) {
  const { currentPet, swipedCount, totalPets, matches, isLoading, error, isDone, swipe, retry } = usePets();

  const progressPercent = totalPets ? Math.round((swipedCount / totalPets) * 100) : 0;

  const handleLike = () => {
    if (currentPet) {
      onLike(currentPet);
      swipe('like');
    }
  };

  const handlePass = () => swipe('pass');

  return (
    <div className="min-h-dvh flex flex-col" data-testid="swipe-view">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6 pb-3">
        <div>
          <h1 className="text-2xl font-black text-amber-900 tracking-tight leading-none">🐾 PawsMatch</h1>
          <p className="text-amber-400 text-xs mt-0.5">Encuentra a tu compañero ideal</p>
        </div>
        <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
          <Heart size={14} className="text-orange-500" fill="#f97316" />
          <span className="text-amber-800 font-bold text-sm">{matches.length}</span>
        </div>
      </header>

      {/* Progress */}
      <div className="px-5 mb-4">
        <div className="h-1 w-full bg-amber-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-amber-400 text-xs mt-1 text-right">{swipedCount} / {totalPets} vistos</p>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 pb-8">
        {isLoading && !currentPet && (
          <div className="flex flex-col items-center gap-4">
            <span className="text-5xl animate-pulse">🐾</span>
            <p className="text-amber-500 font-semibold text-sm">Buscando mascotas...</p>
          </div>
        )}

        {error && (
          <div className="glass-card rounded-3xl p-8 max-w-sm w-full text-center">
            <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
            <p className="text-amber-800 font-bold mb-1">Algo salió mal</p>
            <p className="text-amber-500 text-sm mb-5">{error}</p>
            <button
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-colors"
              onClick={retry}
            >
              <RefreshCw size={15} />
              Intentar de nuevo
            </button>
          </div>
        )}

        {isDone && !currentPet && (
          <div className="glass-card rounded-3xl p-8 max-w-sm w-full text-center">
            <p className="text-6xl mb-4">🎉</p>
            <h2 className="text-xl font-extrabold text-amber-900 mb-2">¡Ya los viste todos!</h2>
            <p className="text-amber-500 text-sm">
              Diste me gusta a <strong>{matches.length}</strong>{' '}
              {matches.length === 1 ? 'perrito' : 'perritos'}.
            </p>
          </div>
        )}

        {currentPet && (
          <div className="relative w-full max-w-sm">
            {/* Stacked ghost cards */}
            {[1, 2].map((i) => (
              <div
                key={i}
                className="absolute inset-0 glass-card rounded-3xl"
                style={{
                  transform: `scale(${1 - i * 0.04}) translateY(${i * 10}px)`,
                  zIndex: -i,
                  opacity: 1 - i * 0.15,
                }}
              />
            ))}
            <PetCard
              pet={currentPet}
              onLike={handleLike}
              onPass={handlePass}
            />
          </div>
        )}
      </main>

      {currentPet && !isDone && (
        <footer className="pb-4 text-center">
          <p className="text-amber-300 text-xs">Arrastra la tarjeta o usa los botones</p>
        </footer>
      )}
    </div>
  );
}
