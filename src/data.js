export const lessons = [
  {
    id: 'l1',
    title: 'Core Web Vitals',
    category: 'Performance',
    color: '#4FC3F7',
    icon: 'Zap',
    concepts: [
      {
        term: 'LCP (Largest Contentful Paint)',
        explanation: 'Mierzy czas do wyrenderowania największego widocznego elementu na stronie (np. głównego obrazka hero lub największego bloku tekstu). W aplikacjach AI częstym problemem jest ładowanie na starcie ciężkich czatów, co opóźnia LCP.\n\n**Cel**: poniżej 2,5 sekundy.'
      },
      {
        term: 'INP (Interaction to Next Paint)',
        explanation: 'Zastąpił FID. Mierzy responsywność aplikacji na działania użytkownika w całym cyklu jej życia. Jeśli klikniesz przycisk "Wygeneruj" i UI "zamrozi się" podczas czekania na odpowiedź modelu (bo wątek główny JS jest zablokowany), Twój INP będzie katastrofalny.\n\n**Cel**: poniżej 200 ms.'
      },
      {
        term: 'CLS (Cumulative Layout Shift)',
        explanation: 'Mierzy stabilność wizualną. W AI to prawdziwy zabójca UX: kiedy streamujesz odpowiedź z LLM (token po tokenie), kontener wiadomości ciągle się powiększa, przesuwając wszystko pod spodem. Rozwiązaniem jest rezerwacja miejsca lub sprytny scroll-anchoring.\n\n**Cel**: poniżej 0,1.'
      }
    ],
    quizzes: [
      {
        question: "Która metryka odpowiada za płynność interakcji i brak 'zamrażania' interfejsu?",
        options: ["LCP", "INP", "CLS", "FCP"],
        correct: 1
      },
      {
        question: "Dlaczego streaming odpowiedzi modelu AI negatywnie wpływa na CLS?",
        options: ["Ponieważ zajmuje cały wątek przeglądarki", "Ponieważ obrazki ładują się wolniej", "Ponieważ dynamicznie powiększający się tekst ciągle przesuwa elementy poniżej", "Streaming nie ma wpływu na CLS"],
        correct: 2
      }
    ]
  },
  {
    id: 'l4',
    title: 'The Modern AI Stack',
    category: 'Architecture',
    color: '#FFD54F',
    icon: 'Database',
    concepts: [
      {
        term: 'End-to-End za pomocą Vercel + Supabase',
        explanation: 'Kombinacja Next.js (hostowanego na Vercel) i Supabase (Baza PostgreSQL z autoryzacją jako usługa) pozwala samodzielnie zbudować całą aplikację. Nie musisz prosić "zespołu backendowego" o stworzenie API.'
      },
      {
        term: 'React Server Components (RSC)',
        explanation: 'Klucz do bezpieczeństwa AI. Kiedy odpytujesz Claude API, musisz użyć tajnego klucza. Jeśli zrobisz to z poziomu przeglądarki, każdy go ukradnie. RSC wykonują się na serwerze - fetchujesz dane z API AI, a do przeglądarki wysyłasz już tylko gotowy tekst (lub UI). Zero ryzyka wycieku kluczy.'
      },
      {
        term: 'Praca bez Specyfikacji',
        explanation: 'W nowoczesnym ekosystemie startupów AI, nikt nie daje Ci 100-stronicowej dokumentacji w JIRA. Otrzymujesz problem biznesowy, łączysz narzędzia i dostarczasz działający prototyp w 48 godzin.'
      }
    ],
    quizzes: [
      {
        question: "Dlaczego integracja API (np. OpenAI) w Client Components jest błędem?",
        options: ["Jest zbyt wolna", "Naraża tajne klucze API na kradzież przez użytkownika", "Powoduje błędy TypeScripta", "React na to nie pozwala"],
        correct: 1
      },
      {
        question: "Co daje wykorzystanie stacku Vercel + Supabase + Next.js?",
        options: ["Tylko szybsze ładowanie stylów CSS", "Możliwość samodzielnego wdrożenia produktu End-to-End przez jedną osobę", "Wymusza pracę w ogromnych zespołach", "Służy tylko do pisania dokumentacji"],
        correct: 1
      }
    ]
  },
  {
    id: 'l5',
    title: 'Krytyczny dobór narzędzi AI',
    category: 'Workflow',
    color: '#CE93D8',
    icon: 'Brain',
    concepts: [
      {
        term: 'Dlaczego Cursor, a nie ChatGPT?',
        explanation: 'ChatGPT to po prostu czat. Cursor to edytor kodu z "Composerem", który widzi wszystkie Twoje pliki na raz. Potrafi napisać funkcję, która rozumie typy z innego pliku i od razu zaaplikować zmiany do drzewa katalogów.'
      },
      {
        term: 'Specjalizacja Modeli',
        explanation: 'Junior używa jednego modelu do wszystkiego. Senior wie, że Perplexity przeszukuje sieć w czasie rzeczywistym z cytowaniami, Sonnet 3.5 jest bezkonkurencyjny w programowaniu, a ElevenLabs niszczy system w generowaniu głosu.'
      },
      {
        term: 'v0.dev / Rapid UI',
        explanation: 'v0.dev (od Vercela) pozwala wygenerować gotowe, piękne komponenty React (Tailwind + Shadcn) w sekundy, używając języka naturalnego. Używasz go, by przeskoczyć żmudne stylowanie flexboxów i od razu przejść do logiki biznesowej.'
      }
    ],
    quizzes: [
      {
        question: "Czym charakteryzuje się dojrzałe, krytyczne podejście do narzędzi AI?",
        options: ["Używaniem najdroższego modelu do każdego zadania", "Odrzuceniem AI i pisaniem wszystkiego od zera", "Wybieraniem konkretnego narzędzia do konkretnego problemu (np. Perplexity vs Claude)", "Poleganiem w 100% na wygenerowanym kodzie bez jego czytania"],
        correct: 2
      }
    ]
  },
  {
    id: 'l6',
    title: 'Automatyzacja (n8n & Zapier)',
    category: 'Automation',
    color: '#FF7043',
    icon: 'Workflow',
    concepts: [
      {
        term: 'Eliminacja pracy ręcznej',
        explanation: 'Podstawowa zasada nowoczesnego inżyniera AI w firmie produktowej: "Jeśli coś jest dzisiaj robione ręcznie (np. przepisywanie danych z maila do CRM), moim zadaniem jest sprawić, by jutro robił to automat".'
      },
      {
        term: 'Data Flows w n8n',
        explanation: 'n8n to potężne narzędzie wizualne (typu node-based), gdzie możesz spiąć Webhooki, API (np. Trello), bazy danych i LLM-y bez pisania ton kodu backendowego. Idealne do budowy wewnętrznych narzędzi dla działu Marketingu.'
      },
      {
        term: 'Internal Tools > Drogie SaaS-y',
        explanation: 'Zamiast płacić 1000$ miesięcznie za kolejne gotowe oprogramowanie B2B dla HR czy Sales, szybko budujesz im workflow w n8n, z podpiętym OpenAI, dając dokładnie to samo za 10$ miesięcznie.'
      }
    ],
    quizzes: [
      {
        question: "Co powinieneś zrobić, gdy zauważysz powtarzalny, codzienny proces biznesowy?",
        options: ["Zignorować go, bo nie jesteś z tego działu", "Zatrudnić stażystę", "Zbudować zautomatyzowany przepływ (np. w n8n), który to przejmie", "Zgłosić jako pomysł na dużą przebudowę architektury za rok"],
        correct: 2
      }
    ]
  },
  {
    id: 'l7',
    title: 'Business Impact & Shipping Fast',
    category: 'Mindset',
    color: '#9CCC65',
    icon: 'Rocket',
    concepts: [
      {
        term: 'Shipping Fast (Wdrażanie w dni, nie miesiące)',
        explanation: 'Akademia dla partnerów biznesowych nie musi powstawać przez pół roku. Z odpowiednim stackiem (AI + Next.js + v0) jesteś w stanie dowieźć działający, zarabiający produkt (lub prototyp) w 3 dni.'
      },
      {
        term: 'The Art of Killing Ideas',
        explanation: 'Zbudowałeś coś, ale nie przynosi to leadów ani nie oszczędza pieniędzy? Musisz umieć wyrzucić ten kod do kosza i ruszyć dalej. Skupiasz się na metrykach biznesowych, nie na tym, jak ładnie napisałeś klasę.'
      },
      {
        term: 'Komunikacja Non-Technical',
        explanation: 'Praca na najwyższym poziomie z AI polega na bezpośrednim kontakcie z założycielami, marketingowcami czy ekspertami domenowymi. Tłumaczysz im możliwości technologiczne na język ich celów (zysk, czas, zasięg), bez używania żargonu programistycznego.'
      }
    ],
    quizzes: [
      {
        question: "Jak należy postąpić z prototypem aplikacji, który po paru dniach weryfikacji przez użytkowników jest bezużyteczny biznesowo?",
        options: ["Refaktorować kod do perfekcji", "Szybko zabić projekt (kill the idea) i skupić się na czymś lepszym", "Wymagać od CEO napisania nowej specyfikacji", "Testować go dalej przez miesiąc"],
        correct: 1
      },
      {
        question: "Jaki jest główny cel pracy inżyniera AI w firmie produktowej wg tego profilu?",
        options: ["Zdobywanie gwiazdek na GitHubie", "Pisanie skomplikowanych algorytmów uczenia maszynowego w Pythonie", "Generowanie realnego wpływu na biznes (oszczędności, leady, automatyzacje)", "Stworzenie frameworka lepszego niż React"],
        correct: 2
      }
    ]
  }
];
