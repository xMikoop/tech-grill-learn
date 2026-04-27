export const lessons = [
  {
    id: 'l1',
    title: 'Core Web Vitals',
    category: 'Performance',
    color: '#4FC3F7',
    icon: 'Zap',
    content: `
      <h3>LCP (Largest Contentful Paint)</h3>
      <p>Mierzy czas do wyrenderowania największego widocznego elementu. <strong>Cel: poniżej 2,5 s</strong>.</p>
      
      <h3>INP (Interaction to Next Paint)</h3>
      <p>Mierzy responsywność na interakcje użytkownika. <strong>Cel: poniżej 200 ms</strong>.</p>
      
      <h3>CLS (Cumulative Layout Shift)</h3>
      <p>Mierzy stabilność wizualną layoutu. <strong>Cel: poniżej 0,1</strong>.</p>
    `,
    quiz: {
      question: "Która metryka odpowiada za stabilność wizualną (brak 'skaczących' elementów)?",
      options: ["LCP", "INP", "CLS", "TTFB"],
      correct: 2
    }
  },
  {
    id: 'l2',
    title: 'Lazy-Loading',
    category: 'Performance',
    color: '#4FC3F7',
    icon: 'Clock',
    content: `
      <p><strong>Lazy-loading</strong> (ładowanie leniwe) to technika, w której zasoby nie są ładowane od razu, lecz dopiero wtedy, gdy są potrzebne.</p>
      
      <h3>Analogia fizyczna</h3>
      <p>To jak układ nerwowy autonomiczny — aktywuje tylko te mięśnie, które są potrzebne.</p>
      
      <h3>Przykład w Next.js</h3>
      <p>Używamy <code>next/dynamic</code> dla ciężkich komponentów.</p>
    `,
    quiz: {
      question: "Kiedy zasób ładowany jest przy 'Lazy-loadingu'?",
      options: ["Zawsze przy starcie", "Dopiero gdy jest potrzebny", "Tylko na urządzeniach mobilnych", "Nigdy"],
      correct: 1
    }
  },
  {
    id: 'l3',
    title: 'API Security',
    category: 'Security',
    color: '#A5D6A7',
    icon: 'Shield',
    content: `
      <p>Bezpieczeństwo kluczy API w Next.js:</p>
      <ul>
        <li>Klucze tylko w <code>.env.local</code>.</li>
        <li>Nigdy nie używaj prefixu <code>NEXT_PUBLIC_</code> dla kluczy tajnych.</li>
        <li>Wywołania tylko w Server Actions lub Route Handlers.</li>
      </ul>
    `,
    quiz: {
      question: "Który prefix sprawia, że zmienna środowiskowa jest widoczna dla klienta?",
      options: ["SECRET_", "PRIVATE_", "NEXT_PUBLIC_", "API_"],
      correct: 2
    }
  },
  {
    id: 'l4',
    title: 'The Modern AI Stack',
    category: 'Architecture',
    color: '#FFD54F',
    icon: 'Database',
    content: `
      <h3>Vercel + Supabase + Next.js</h3>
      <p>Ten stos technologiczny to fundament budowy nowoczesnych aplikacji AI typu end-to-end. Pozwala na samodzielne stworzenie pełnego produktu bez czekania na specyfikację (Backend-as-a-Service).</p>
      
      <h3>Dlaczego używamy Next.js? (Krytyczne spojrzenie)</h3>
      <p>Nie chodzi tylko o "jak to napisać", ale o architekturę. Wykorzystujemy <strong>React Server Components (RSC)</strong> do bezpiecznego łączenia warstwy AI, ukrywania kluczy API na serwerze i eliminowania ciężkich bundli JS u klienta.</p>
      
      <h3>Filozofia pracy</h3>
      <p>Od idei do działającego produktu — rozumiesz jak zbudować frontend, spiąć go z bazą danych (np. Supabase z autoryzacją) i wdrożyć na produkcję (Vercel) jednym kliknięciem.</p>
    `,
    quiz: {
      question: "Co daje wykorzystanie stacku Vercel + Supabase + Next.js?",
      options: ["Tylko szybsze ładowanie stylów CSS", "Możliwość samodzielnego zbudowania produktu End-to-End", "Wymusza pracę w ogromnych zespołach", "Służy tylko do pisania dokumentacji"],
      correct: 1
    }
  },
  {
    id: 'l5',
    title: 'Krytyczny dobór narzędzi AI',
    category: 'Workflow',
    color: '#CE93D8',
    icon: 'Brain',
    content: `
      <h3>Ecosystem Tools</h3>
      <p>Codzienne korzystanie z narzędzi takich jak <strong>Cursor, Claude, v0, Stitch czy ElevenLabs</strong>. Nie wystarczy ich tylko znać, trzeba wiedzieć, do czego nadają się najlepiej.</p>
      
      <h3>Praktyczny przykład (Wiedza Krytyczna)</h3>
      <p><em>"Używam Perplexity do researchu, ponieważ przeszukuje internet w czasie rzeczywistym z cytowaniami, ale używam Claude 3.5 Sonnet do pisania kodu, bo ma o wiele lepsze rozumienie kontekstu całego repozytorium niż GPT-4."</em></p>
      
      <h3>Speeding up the layer</h3>
      <p>LLM przyspiesza każdą warstwę: pisanie kodu, generowanie copy na landing page, analizę decyzji biznesowych czy generowanie interfejsów (v0.dev).</p>
    `,
    quiz: {
      question: "Czym charakteryzuje się krytyczne podejście do narzędzi AI?",
      options: ["Używaniem ChatGPT do absolutnie każdego zadania", "Ślepym wklejaniem kodu z Cursora na produkcję", "Wiedzą, które narzędzie (np. Claude vs Perplexity) rozwiąże dany problem najlepiej", "Unikaniem używania AI, by pisać kod w 100% samemu"],
      correct: 2
    }
  },
  {
    id: 'l6',
    title: 'Automatyzacja i Data Flows',
    category: 'Automation',
    color: '#FF7043',
    icon: 'Workflow',
    content: `
      <h3>Złota zasada Automatyzacji</h3>
      <p><strong>"Jeśli coś jest robione ręcznie dzisiaj, twoim zadaniem jest to zautomatyzować do jutra."</strong></p>
      
      <h3>Narzędzia: n8n, Make, Zapier</h3>
      <p>Eksploracja i budowa integracji to klucz. Budowanie przepływów danych (Data flows) pomiędzy różnymi platformami. Zamiast płacić 1000$ miesięcznie za drogi SaaS, potrafisz zbudować w n8n własne wewnętrzne narzędzie (Internal Tool), które robi to samo z użyciem API OpenAI.</p>
      
      <h3>Marketing Workflows</h3>
      <p>Wdrażanie AI do prawdziwych procesów: zautomatyzowana produkcja treści, narzędzia dla kampanii, systemy dla partnerów.</p>
    `,
    quiz: {
      question: "Co powinieneś zrobić, gdy zauważysz proces biznesowy wykonywany codziennie ręcznie?",
      options: ["Zignorować go, bo to nie kod", "Zautomatyzować go używając np. n8n lub własnego skryptu", "Zatrudnić więcej osób do jego wykonywania", "Zrobić ticket w JIRA i czekać rok"],
      correct: 1
    }
  },
  {
    id: 'l7',
    title: 'Business Impact & Prototyping',
    category: 'Mindset',
    color: '#9CCC65',
    icon: 'Rocket',
    content: `
      <h3>Realny wpływ na biznes</h3>
      <p>Budujesz narzędzia AI nie jako techniczne dema do portfolio, ale po to, by generować leady, ucinać koszty i przynosić realne pieniądze firmie.</p>
      
      <h3>Shipping Fast</h3>
      <p>Przechodzenie od pomysłu do działającego rozwiązania w kilka dni (np. zbudowanie całej platformy akademii dla partnerów w 3 dni). Unifikacja różnych marek w jeden spójny ekosystem technologiczny.</p>
      
      <h3>Killing Ideas</h3>
      <p>Szybkie prototypowanie oznacza też <strong>szybkie zabijanie własnych pomysłów</strong>. Jeśli po dwóch dniach widzisz, że eksperyment nie działa na rynku lub technologia zawodzi — usuwasz kod i idziesz dalej bez żalu.</p>
      
      <p><em>Pamiętaj: współpracujesz bezpośrednio z ludźmi nietechnicznymi (marketing, CEO) - nie potrzebujesz trzymania za rękę w środowisku wysokiego zaufania.</em></p>
    `,
    quiz: {
      question: "Jak należy postąpić z prototypem aplikacji, który po 2 dniach testów wyraźnie nie przynosi rezultatów biznesowych?",
      options: ["Refaktorować kod do perfekcji, aż zadziała", "Spróbować wdrożyć inną bibliotekę UI", "Szybko zabić projekt (kill the idea) i skupić się na czymś lepszym", "Wymagać od CEO napisania nowej specyfikacji"],
      correct: 2
    }
  }
];
