import React from 'react';
import { useImmersionStore } from '../../store/useImmersionStore';

const Supernova = () => {
  const showSupernova = useImmersionStore((state) => state.showSupernova);

  if (!showSupernova) return null;

  return (
    <div className="fixed inset-0 z-[1000] pointer-events-none flex items-center justify-center">
      <div className="supernova-core w-1 h-1 bg-white rounded-full shadow-[0_0_100px_50px_#fff,0_0_200px_100px_var(--color-plasma)] animate-ping" />
    </div>
  );
};

export default Supernova;
