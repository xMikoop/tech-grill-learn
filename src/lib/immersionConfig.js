export const STREAMS = {
  metal: { title: 'SomaFM Metal Detector', url: 'https://ice1.somafm.com/metal-128-mp3' },
  ambient: { title: 'SomaFM Groove Salad', url: 'https://ice1.somafm.com/groovesalad-128-mp3' },
  synth: { title: 'SomaFM Deep Space One', url: 'https://ice1.somafm.com/deepspaceone-128-mp3' },
  lofi: { title: 'SomaFM The Trip (Lofi)', url: 'https://ice1.somafm.com/thetrip-128-mp3' },
};

export const ATMOSPHERES = {
  space_adhd: {
    name: 'Stabilna Orbita',
    bg: 'radial-gradient(circle at center, #0A0A14 0%, #1A1A2E 100%)',
    accent: '#7B61FF',
    animation: 'satellites',
    music: 'lofi',
    why: 'Dla osoby z ADHD delikatny ruch obiektów satelitarnych zaspokaja potrzebę stymulacji wizualnej, pozwalając skupić główną uwagę na nauce.',
  },
  nature_calm: {
    name: 'Leśna Cisza',
    bg: 'radial-gradient(circle at center, #051605 0%, #0A0A14 100%)',
    accent: '#39FF14',
    animation: 'clouds',
    music: 'ambient',
    why: 'Organiczne barwy i powolne ruchy redukują poziom kortyzolu, co sprzyja głębokiej koncentracji u osób potrzebujących wyciszenia.',
  },
  tech_motivated: {
    name: 'Cyber-Flow',
    bg: 'radial-gradient(circle at center, #0A0A14 0%, #001220 100%)',
    accent: '#00E5FF',
    animation: 'grid',
    music: 'synth',
    why: 'Wysoki kontrast i dynamiczne linie siatki stymulują dopaminę, wspierając stan "Flow" podczas intensywnej nauki.',
  },
  space_stressed: {
    name: 'Ciemna Mgławica',
    bg: 'radial-gradient(circle at center, #0A0A14 0%, #0D0D2B 100%)',
    accent: '#A594FF',
    animation: 'clouds',
    music: 'ambient',
    why: 'Wolno pulsujące mgławice w ciemnym odcieniu granatu obniżają napięcie nerwowe i sprzyjają skupieniu u osób w stanie stresu.',
  },
};
