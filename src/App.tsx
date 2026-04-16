import { useState } from 'react';
import SwipeView from './views/SwipeView';
import AdoptionDetails from './views/AdoptionDetails';
import type { PetWithImage } from './types/pet';

type View = 'swipe' | 'adoption';

export default function App() {
  const [view, setView] = useState<View>('swipe');
  const [selectedPet, setSelectedPet] = useState<PetWithImage | null>(null);

  const handleLike = (pet: PetWithImage) => {
    setSelectedPet(pet);
    setView('adoption');
  };

  const handleBack = () => {
    setView('swipe');
  };

  return (
    <div className="min-h-dvh">
      {view === 'swipe' && <SwipeView onLike={handleLike} />}
      {view === 'adoption' && <AdoptionDetails pet={selectedPet} onBack={handleBack} />}
    </div>
  );
}
