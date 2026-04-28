import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useImmersionStore } from '../store/useImmersionStore';
import { ATMOSPHERES, STREAMS } from '../lib/immersionConfig';

export function useOnboarding() {
  const [obForm, setObForm] = useState({
    mood: '',
    neuroProfile: 'neurotypical',
    interests: '',
    calm: '',
    energy: '',
    joy: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const setView = useAppStore((state) => state.setView);
  const setActiveAtmosphere = useAppStore((state) => state.setActiveAtmosphere);
  const setMusicConfig = useAppStore((state) => state.setMusicConfig);
  const setIsPlaying = useImmersionStore((state) => state.setIsPlaying);
  const setXp = useAppStore((state) => state.setXp);

  const analyzeProfile = async () => {
    setIsAnalyzing(true);
    await new Promise((r) => setTimeout(r, 2500));

    let profileKey = 'tech_motivated'; // Default

    if (obForm.neuroProfile === 'calm_needed' || obForm.neuroProfile === 'hsp') {
      profileKey = 'nature_calm';
    } else if (obForm.neuroProfile === 'adhd') {
      profileKey = 'space_adhd';
    } else if (obForm.mood === 'stressed') {
      profileKey = 'space_stressed';
    } else if (obForm.interests === 'Cyberpunk' || obForm.interests === 'Technologia') {
      profileKey = 'tech_motivated';
    } else if (obForm.interests === 'Natura' || obForm.interests === 'Minimalizm') {
      profileKey = 'nature_calm';
    } else if (obForm.interests === 'Kosmos') {
      profileKey = 'space_adhd';
    }

    const selectedAtmos = ATMOSPHERES[profileKey];
    setActiveAtmosphere(selectedAtmos);
    setMusicConfig(STREAMS[selectedAtmos.music]);

    setIsAnalyzing(false);
    setView('dashboard');
    setIsPlaying(true);

    // Initial XP reward
    setXp((prev) => prev + 150);
  };

  return {
    obForm,
    setObForm,
    isAnalyzing,
    analyzeProfile,
  };
}
