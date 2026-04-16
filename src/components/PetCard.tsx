import { useRef, useState } from 'react';
import { Heart, X, MapPin, Tag } from 'lucide-react';
import type { PetWithImage } from '../types/pet';

interface Props {
  pet: PetWithImage;
  onLike: () => void;
  onPass: () => void;
}

const SWIPE_THRESHOLD = 90;

export default function PetCard({ pet, onLike, onPass }: Props) {
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLeaving, setIsLeaving] = useState<'like' | 'pass' | null>(null);
  const startX = useRef(0);
  const startY = useRef(0);

  const likeOpacity = Math.min(Math.max(dragX / SWIPE_THRESHOLD, 0), 1);
  const passOpacity = Math.min(Math.max(-dragX / SWIPE_THRESHOLD, 0), 1);

  const triggerSwipe = (direction: 'like' | 'pass') => {
    setIsLeaving(direction);
    setDragX(0);
    setDragY(0);
    setTimeout(() => {
      setIsLeaving(null);
      if (direction === 'like') onLike();
      else onPass();
    }, 280);
  };

  const cardStyle: React.CSSProperties = isLeaving
    ? {
        transform: isLeaving === 'like'
          ? 'translateX(110%) rotate(20deg)'
          : 'translateX(-110%) rotate(-20deg)',
        opacity: 0,
        transition: 'all 0.28s cubic-bezier(0.55,0,1,0.45)',
        pointerEvents: 'none',
      }
    : isDragging
    ? {
        transform: `translate(${dragX}px, ${dragY * 0.3}px) rotate(${(dragX / 20).toFixed(2)}deg)`,
        transition: 'none',
        cursor: 'grabbing',
      }
    : {};

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    startY.current = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragX(e.clientX - startX.current);
    setDragY(e.clientY - startY.current);
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragX > SWIPE_THRESHOLD) triggerSwipe('like');
    else if (dragX < -SWIPE_THRESHOLD) triggerSwipe('pass');
    else { setDragX(0); setDragY(0); }
  };

  return (
    <div
      className="relative w-full max-w-sm mx-auto select-none"
      style={cardStyle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      data-testid="pet-card"
    >
      {/* Swipe hint labels */}
      <div
        className="absolute top-8 left-6 z-20 border-4 border-red-500 text-red-500 px-3 py-1 rounded-lg font-black text-xl uppercase tracking-widest pointer-events-none rotate-12"
        style={{ opacity: passOpacity }}
      >
        Pasar
      </div>
      <div
        className="absolute top-8 right-6 z-20 border-4 border-green-500 text-green-500 px-3 py-1 rounded-lg font-black text-xl uppercase tracking-widest pointer-events-none -rotate-12"
        style={{ opacity: likeOpacity }}
      >
        ¡Me gusta!
      </div>

      {/* Card */}
      <div className="glass-card rounded-3xl overflow-hidden">
        {/* Photo */}
        <div className="relative h-80 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-200">
          {pet.imageUrl ? (
            <img
              src={pet.imageUrl}
              alt={pet.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl">🐶</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <span className="absolute top-4 right-4 flex items-center gap-1 bg-white/80 backdrop-blur-sm text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full">
            <Tag size={11} />
            {pet.breed}
          </span>
        </div>

        {/* Info */}
        <div className="px-6 pt-5 pb-3">
          <h2 className="text-2xl font-extrabold text-amber-900 mb-1 leading-tight">{pet.name}</h2>
          <div className="flex items-center gap-1 text-amber-400 text-xs mb-3">
            <MapPin size={12} />
            <span>Guatemala, GT</span>
          </div>
          <p className="text-amber-700 text-sm leading-relaxed whitespace-pre-line line-clamp-3">{pet.bio}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 px-6 pb-5 pt-2">
          <button
            aria-label="Pasar"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-red-200 bg-red-50 hover:bg-red-100 active:scale-95 text-red-500 font-bold text-sm transition-all"
            onClick={(e) => { e.stopPropagation(); triggerSwipe('pass'); }}
          >
            <X size={18} strokeWidth={3} />
            Pasar
          </button>
          <button
            aria-label="Adoptar"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-bold text-sm shadow-lg transition-all"
            onClick={(e) => { e.stopPropagation(); triggerSwipe('like'); }}
          >
            <Heart size={18} strokeWidth={2.5} fill="white" />
            Adoptar
          </button>
        </div>
      </div>
    </div>
  );
}
