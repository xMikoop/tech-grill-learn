export const lessons = [
  {
    id: 'l1',
    title: 'Core Web Vitals w architekturze AI',
    category: 'Performance',
    color: '#4FC3F7',
    icon: 'Zap',
    concepts: [
      {
        term: 'LCP (Largest Contentful Paint) - Optyka i Grafy renderowania',
        explanation: `
          <h3>Fizyka: Czas dotarcia pierwszych fotonów</h3>
          <p>LCP mierzy czas renderowania największego elementu w widocznym oknie przeglądarki (viewport). W fizyce optycznej możemy to przyrównać do czasu potrzebnego na dotarcie pierwszego pełnego obrazu z soczewki do siatkówki. Jeśli źródło światła jest przysłonięte (blokujące skrypty JS) lub zablokowane za skomplikowanym układem luster (przekierowania sieciowe), czas ten rośnie drastycznie.</p>
          
          <h3>Matematyka: Szukanie ekstremum funkcji pola</h3>
          <p>Przeglądarka oblicza LCP algorytmicznie. Szuka maksimum funkcji powierzchni: <code>LCP = argmax_i ( Powierzchnia(Element_i) )</code>, gdzie Element_i znajduje się w viewport. W aplikacjach z AI często największym elementem jest wygenerowany obraz lub główny kontener czatu. Jeśli ładujesz go asynchronicznie (lazy-load), przesuniesz LCP w czasie o całą fazę TTI (Time to Interactive).</p>
          
          <h3>Implementacja: Vercel i next/image</h3>
          <p>Aby LCP było poniżej 2.5s (wymóg "Good" w Google Search Console), musimy zaimplementować priorytetyzację (Preloading) dla węzła grafu renderowania.</p>
          <pre><code>// ŹLE: Obrazek czeka na wykonanie JS
&lt;img src="/ai-hero.webp" loading="lazy" /&gt;

// DOBRZE: Next.js wstrzykuje tag &lt;link rel="preload" as="image"&gt; 
// na poziomie nagłówków HTTP, zanim pobierze się HTML
import Image from 'next/image';
&lt;Image 
  src="/ai-hero.webp" 
  alt="AI Hero" 
  priority={true} 
  fetchPriority="high" 
/&gt;</code></pre>
          <p>Pod spodem, przeglądarka stosuje algorytmy heurystyczne do alokacji pasma sieciowego. Ustawienie <code>fetchPriority="high"</code> wypycha ten zasób na początek kolejki HTTP/2 Multiplexing, omijając wąskie gardło blokujących zasobów CSS/JS.</p>
        `
      },
      {
        term: 'INP (Interaction to Next Paint) - Opóźnienia w Układach Dynamicznych',
        explanation: `
          <h3>Fizyka: Odpowiedź Impulsowa Układu</h3>
          <p>INP to nowa metryka zastępująca FID (First Input Delay). Mierzy "lag" między akcją użytkownika a reakcją wizualną interfejsu (Next Paint). W teorii sterowania (Control Theory) jest to odpowiedź impulsowa układu nieliniowego (Impulse Response). Jeśli wstrzykniesz impuls (kliknięcie), jak szybko układ ustabilizuje nowy stan wizualny? Idealnie poniżej 200 milisekund.</p>
          
          <h3>Matematyka: P98 (98. percentyl) rozkładu latencji</h3>
          <p>INP nie jest średnią. To 98. percentyl najgorszych interakcji w całej sesji życia strony: <code>INP = P_98( { t_render(i) - t_input(i) | i ∈ Akcje } )</code>. Dlaczego 98? Ponieważ pojedyncze "zacięcie" na 2 sekundy (wyjątek odstający) potrafi całkowicie zniszczyć doświadczenie użytkownika, nawet jeśli 99% kliknięć było natychmiastowych.</p>
          
          <h3>Algorytmika i Implementacja: Yielding to Main Thread</h3>
          <p>W aplikacjach AI, parsowanie dużych JSON-ów z LLM (często dziesiątki megabajtów w RAG) drastycznie blokuje główny wątek (Main Thread). Rozwiązaniem jest algorytm "Chunking" lub użycie Web Workers.</p>
          <pre><code>// 1. ZŁA IMPLEMENTACJA (Blokuje INP, UI zamarza na 500ms)
const processLlmResponse = (hugeData) => {
  const result = heavyCompute(hugeData); // O(n^2) na wątku UI
  setUIState(result); 
};

// 2. DOBRA IMPLEMENTACJA: Koncepcja "Yielding" z React 18
// useTransition obniża priorytet renderowania AI na rzecz kliknięć użytkownika
import { useTransition, useState } from 'react';

const ChatInput = () => {
  const [isPending, startTransition] = useTransition();
  const [text, setText] = useState('');

  const handleChange = (e) => {
    // 1. Natychmiastowa reakcja (INP wynosi 10ms)
    setText(e.target.value); 
    
    // 2. Przeniesienie ciężkiego re-renderowania czatu do tła
    startTransition(() => {
      processAiHighlighting(e.target.value);
    });
  };
};</code></pre>
        `
      },
      {
        term: 'CLS (Cumulative Layout Shift) - Entropia i Stabilność Ciała Stałego',
        explanation: `
          <h3>Fizyka: Przesunięcia Tektoniczne i Siła Ścinająca</h3>
          <p>Wyobraź sobie interfejs użytkownika jako budynek. CLS to miara wstrząsów sejsmicznych podczas jego budowy. Gdy ładujesz z opóźnieniem komponent (np. polecam wygenerowany przez AI produkt), wstawiasz nagle masywny blok piętro wyżej. Fizyka układu sprawia, że wszystko poniżej ulega gwałtownemu przesunięciu. W kontekście AI, streaming odpowiedzi wywołuje ciągłe mikrowstrząsy (mikro-layout shifts).</p>
          
          <h3>Matematyka: Całkowanie Przesunięć Przestrzennych</h3>
          <p>Google oblicza CLS ze wzoru: <code>Impact Fraction × Distance Fraction</code>. Oznacza to, że jeśli wygenerowany tekst z LLM przesunie przycisk, który zajmował 50% ekranu o kolejne 25% w dół, wynik wynosi <code>0.5 × 0.25 = 0.125</code> (co już klasyfikuje się jako złe "Needs Improvement" - próg wynosi 0.1).</p>
          
          <h3>Implementacja: Skeleton Screens i Scroll Anchoring</h3>
          <p>Rozwiązaniem algorytmicznym jest pre-alokacja pamięci wizualnej (Visual Memory Pre-allocation) - przeglądarka musi znać dokładne wymiary (bounding box) zanim pobierze treść.</p>
          <pre><code>/* 1. Rozwiązanie CSS: Użycie aspect-ratio */
.ai-generated-image-container {
  width: 100%;
  aspect-ratio: 16 / 9; /* Rezerwuje miejsce na wysokość ZANIM obraz się załaduje! */
  background: var(--skeleton-pulse);
}

/* 2. Rozwiązanie React dla Streamingu LLM */
// Stosujemy min-height, aby kontener rosnącego tekstu 
// nie wypychał stopki w nieskończoność skokami co 50ms.
&lt;div className="relative min-h-[400px] max-h-[80vh] overflow-y-auto overflow-x-hidden"&gt;
  &lt;AiStreamingMarkdown content={streamedChunks} /&gt;
  {/* Włączamy CSS Scroll Anchoring */}
  &lt;div style={{ overflowAnchor: 'auto' }}&gt;&lt;/div&gt;
&lt;/div&gt;</code></pre>
        `
      }
    ],
    quizzes: [
      {
        question: "Dlaczego `useTransition` w React 18 jest kluczowe dla poprawy wskaźnika INP podczas przetwarzania dużych odpowiedzi z LLM?",
        options: ["Ustawia timeout na pobieranie danych", "Pozwala przerwać renderowanie poboczne i odpowiedzieć natychmiast na interakcję użytkownika (Yielding to Main Thread)", "Konwertuje kod JS na kod WebAssembly, który wykonuje się szybciej", "Kompresuje wielkość pliku JavaScript przed jego wykonaniem"],
        correct: 1
      }
    ]
  },
  {
    id: 'l4',
    title: 'The Modern AI Stack: Deep Dive',
    category: 'Architecture',
    color: '#FFD54F',
    icon: 'Database',
    concepts: [
      {
        term: 'React Server Components (RSC) vs Client Components',
        explanation: `
          <h3>Fizyka: Przesyłanie Materii (Client) vs Przesyłanie Światła (RSC)</h3>
          <p>Tradycyjny React (Client Components) działał jak wysyłanie fabryki (kodu JS) do klienta, aby sam zbudował produkt (DOM). To kosztuje energię i czas (wielkość bundle'a, parsowanie V8 Engine). RSC to wysyłanie gotowych fotonów (zserializowanego drzewa UI) - klient odbiera gotowy widok i natychmiast go wyświetla, zero kosztów parsowania ogromnych bibliotek.</p>
          
          <h3>Algorytmika: Serializacja Drzewa AST i format "Wire"</h3>
          <p>Kiedy zwracasz komponent na serwerze, Next.js wykonuje jego logikę i serializuje wynik do specjalnego strumieniowego formatu (Wire Format). Węzły serwerowe oznaczane są jako "J" (zwykły JSON node), a komponenty klienckie jako "I" (Instruction reference). To graf dwudzielny, gdzie wierzchołki serwerowe nie mogą importować klienckich.</p>
          
          <h3>Zastosowanie dla bezpieczeństwa AI:</h3>
          <pre><code>// 🚀 SERVER COMPONENT (app/page.tsx)
// Cały ten kod uruchamia się w chmurze (np. AWS Lambda / Vercel Edge).
// Klucze API NIGDY nie trafią do sieci (Network Tab).
import { OpenAI } from 'openai';
import ChatUI from './ChatUI'; // Client Component

export default async function AIPage() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY });
  // Oczekujemy na odpowiedź serwerowo (Node.js)
  const completion = await openai.chat.completions.create({...});
  
  // Do przeglądarki trafia jedynie WYGENEROWANY STRING.
  // Sama biblioteka 'openai' (ważąca 1MB) NIE JEST wysyłana do przeglądarki!
  return &lt;ChatUI initialMessage={completion.choices[0].message.content} /&gt;;
}</code></pre>
        `
      },
      {
        term: 'Supabase i algorytmologia Row Level Security (RLS)',
        explanation: `
          <h3>Matematyka: Teoria Zbiorów i Filtry Permutacyjne</h3>
          <p>Kiedy używamy PostgreSQL z Supabase w nowoczesnym AI Stacku, całkowicie omijamy warstwę backendu (Node.js/Express) wymyślając koncepcję RLS. Matematycznie, każde zapytanie SQL, np. <code>SELECT * FROM conversations</code>, jest przechwytywane przez RLS i przekształcane poprzez przecięcie zbiorów: <code>Wynik = Zbiór(zapytania) ∩ Zbiór(reguły RLS)</code>.</p>
          
          <h3>Implementacja i Architektura Backend-less</h3>
          <p>Użytkownik wysyła zapytanie bezpośrednio z przeglądarki do Bazy Danych za pomocą bezpiecznego klucza <code>anon_key</code> z przypiętym w nagłówku tokenem JWT (autoryzacja). Baza Postgres wyłuskuje z JWT ID użytkownika i dokleja je jako klauzulę WHERE na poziomie wirtualnej maszyny zapytań (Query Planner).</p>
          <pre><code>-- Przykładowa polisa Row Level Security (SQL) dla logów AI
CREATE POLICY "Users can only read their own AI chat logs"
ON public.ai_conversations
FOR SELECT
USING (
  -- authn.uid() to algorytm dekodujący JWT w locie z nagłówka HTTP
  user_id = auth.uid() 
);</code></pre>
          <p>Dzięki temu, nawet jeśli haker przechwyci Twoje zapytanie na froncie i wklei do Postmana zapytanie "Daj mi wszystkie logi (limit 1000)", baza danych odrzuci to na najniższym poziomie, bez obciążania pamięci operacyjnej na filtrowanie w kodzie aplikacji.</p>
        `
      }
    ],
    quizzes: [
      {
        question: "Na czym polega bezpieczeństwo używania LLM API z poziomu React Server Components?",
        options: ["Klucze API są szyfrowane kryptografią asymetryczną zanim trafią do przeglądarki", "Biblioteki takie jak 'openai' i kody wywołujące API pozostają na serwerze (Backend/Edge), do przeglądarki trafia tylko sam wygenerowany widok", "RSC nakłada blokadę na użycie CORS", "Vercel automatycznie weryfikuje captche dla każdego wywołania"],
        correct: 1
      }
    ]
  },
  {
    id: 'l5',
    title: 'Narzędzia AI: Algorytmy i Granice',
    category: 'Workflow',
    color: '#CE93D8',
    icon: 'Brain',
    concepts: [
      {
        term: 'Wektorowe Przeszukiwanie Semantyczne (Cursor vs ChatGPT)',
        explanation: `
          <h3>Matematyka: Przestrzenie Wielowymiarowe i Cosine Similarity</h3>
          <p>Kiedy pytasz ChatGPT o swój kod, musi on zrozumieć tekst na podstawie wrzuconego małego kawałka kodu. Kiedy używasz Cursora (Edytor natywny z AI), pod spodem dzieje się prawdziwa magia matematyczna. Całe Twoje repozytorium jest rozbijane na porcje (chunking) i mapowane do przestrzeni 1536-wymiarowej (Embeddingi). Kiedy zadajesz pytanie w Cursorze, konwertuje on zapytanie na wektor w tej samej przestrzeni.</p>
          
          <p>Następnie silnik wyszukiwania (często lokalny FAISS lub HNSW - Hierarchical Navigable Small World) oblicza <strong>podobieństwo kosinusowe</strong>: <code>cos(θ) = (A · B) / (||A|| ||B||)</code>. Znajduje pliki w Twoim projekcie, których "znaczenie" (kąt między wektorami) jest najbliższe Twojemu pytaniu, po czym ładuje te konkretne pliki do "Context Window" LLM-a. To dlatego Cursor potrafi "domyślić się", że błąd w komponencie UI wynika z definicji interfejsu w pliku <code>types.d.ts</code>, o którym zapomniałeś wspomnieć.</p>
        `
      },
      {
        term: 'Architektura LLM: Dlaczego Claude 4.7 "myśli" inaczej?',
        explanation: `
          <h3>Algorytmika: Transformery i Attention Mechanism</h3>
          <p>Nie wszystkie modele są równe. Architektura z rodziny Claude 4.7 (Sonnet/Opus) wyróżnia się w programowaniu, ponieważ jej algorytm wagi "Attention" (uwagi) posiada ulepszony routing bloków MoE (Mixture of Experts). Zamiast uruchamiać 1 trylion parametrów jednocześnie, dzieli sieć na ekspertów. Posiada on tzw. <strong>"Needle in a Haystack" accuracy na poziomie 99.9% dla 500,000 tokenów</strong>. Możesz wrzucić do niego kod całego systemu operacyjnego, a on bezbłędnie znajdzie błąd off-by-one w jednej z pętli.</p>
          
          <h3>Praktyka i Użycie (Kwietniowe Realia 2026)</h3>
          <p>Użycie AI jest dzisiaj inżynierią zasobów i kompromisów przestrzennych:</p>
          <ul>
            <li><strong>Claude 4.7 Sonnet:</strong> Szybki architekt o ogromnym kontekście. Posiada minimalną bezwładność, idealny do asynchronicznego generowania wieloplikowych struktur (np. Next.js App Router).</li>
            <li><strong>Perplexity (Pro/Enterprise):</strong> Architektura RAG (Retrieval-Augmented Generation) połączona z Live Web Search. Nie ufa własnym wagom z czasów trenowania, tylko w czasie rzeczywistym tworzy wektory wyszukiwań i wstrzykuje najnowszą dokumentację do promptu, redukując halucynacje z 15% do &lt;1%.</li>
            <li><strong>v0.dev / Bolt.new:</strong> Systemy oparte o model multimodalny połączony z kontenerem WebContainers (Node.js bezpośrednio w przeglądarce). Budują one kod i renderują go obok czatu na tym samym cyklu procesora.</li>
          </ul>
        `
      },
      {
        term: 'SLM (Small Language Models) na Krawędzi Sieci (Edge AI)',
        explanation: `
          <h3>Optyka Pamięciowa: Quantization i LoRA</h3>
          <p>Gigantyczne modele LLM ważą terabajty. Przełomem stały się modele SLM (Small Language Models), jak Qwen2.5-Coder-7B czy Llama 3.2-3B. Mają one poniżej 10 miliardów parametrów, ale po poddaniu ich procesowi "Kwantyzacji" (zmniejszeniu precyzji zmiennoprzecinkowych wag z 16-bitów na 4-bity), ważą zaledwie 3-5 GB.</p>
          
          <h3>Fizyka Cząsteczek: Lokalny Inference</h3>
          <p>Możesz uruchomić takiego SLM-a bezpośrednio w przeglądarce za pomocą WebGPU lub na telefonie! Algorytmy używają Fine-Tuningu (np. LoRA), aby douczyć mały model bardzo specyficznej, jednej rzeczy (np. tylko React Tailwind). Dzięki temu mały model bije o głowę ogólnego, gigantycznego GPT w tej jednej, konkretnej domenie.</p>
        `
      }
    ],
    quizzes: [
      {
        question: "Jaki algorytm używany jest pod spodem, by narzędzia takie jak Cursor wiedziały, które pliki z Twojego repozytorium załączyć do kontekstu rozmowy z LLM?",
        options: ["Losowe wyszukiwanie pełnotekstowe (Regex)", "Porównywanie podobieństwa kosinusowego wektorów matematycznych (Cosine Similarity dla Embeddingów)", "Drzewa decyzyjne z biblioteki Scikit-Learn", "Standardowe zapytania SQL LIKE na nazwach plików"],
        correct: 1
      }
    ]
  },
  {
    id: 'l6',
    title: 'Automatyzacja i Inżynieria Przepływów',
    category: 'Automation',
    color: '#FF7043',
    icon: 'Workflow',
    concepts: [
      {
        term: 'Teoria Przepływów Danych: Grafy Skierowane (DAG) w N8N',
        explanation: `
          <h3>Informatyka: Directed Acyclic Graphs (DAG)</h3>
          <p>Kiedy automatyzujesz procesy w narzędziach takich jak N8N (czy Apache Airflow w dużej skali), nie piszesz po prostu funkcji wywołującej kolejną funkcję. Definiujesz strukturę zwaną Grafem Skierowanym Acyklicznym (DAG). Jest to zbiór "węzłów" (Nodes - np. "Pobierz e-mail", "Wyślij do OpenAI", "Zapisz w Notion") połączonych krawędziami "skierowanymi" (od A do B), bez możliwości wystąpienia pętli nieskończonej (Acykliczność).</p>
          
          <h3>Fizyka: Przepływ Płynów i Wąskie Gardła (Bottlenecks)</h3>
          <p>Analogią do przepływu danych w N8N jest układ hydrauliczny (Równanie ciągłości strumienia <code>Q = A × v</code>). Jeśli węzeł "Pobierz e-maile" wysyła strumień 1000 maili na minutę (Q1), a Twój węzeł "Analiza OpenAI API" pozwala na przetworzenie tylko 50 requestów na minutę ze względu na limity API Rate-Limit (Q2), system pęknie (błąd 429 Too Many Requests).</p>
          
          <h3>Implementacja inżynieryjna w N8N</h3>
          <p>Rozwiązaniem tego problemu w architekturze przepływów jest wprowadzenie wzorca <strong>"Queue" (Kolejka) i "Batching" (Paczkowanie)</strong>. Zamiast wysyłać maile pojedynczo, zbierasz je w Node "Split in Batches" (np. po 20 sztuk) i pomiędzy kolejnymi wywołaniami narzucasz pauzę <code>await sleep(1000)</code>, działając jak fizyczny zawór redukcyjny w rurze.</p>
        `
      },
      {
        term: 'Integracja AI z Marketingiem - Algorytmy Segmentacji',
        explanation: `
          <h3>Od zastępowania ludzi do wspomagania na wielką skalę</h3>
          <p>Marketer nie jest w stanie napisać 500 w pełni unikalnych maili dostosowanych do każdego klienta B2B, biorąc pod uwagę najnowsze tweety z profilu firmy klienta. Dla Seniora AI Automation to bułka z masłem.</p>
          
          <h3>Przepływ automatyzacji w praktyce:</h3>
          <pre><code>// Pseudokod architektury N8N (Event-Driven Architecture)
1. Webhook(Trigger) -> Ktoś zapisał się do formularza
2. HTTP Request -> Wywołaj Clearbit API by pobrać domenę firmy klienta z jego maila
3. Web Scraper Node -> Wejdź na domenę firmy i pobierz zawartość tagu &lt;body&gt; w HTML
4. Transform (JS) -> Skonwertuj HTML do czystego Markdowna (redukcja 90% kosztów tokenów LLM)
5. OpenAI (Node) -> 
   PROMPT: "Jesteś ekspertem sprzedaży B2B. Użytkownik z firmy [Domena] zapisał się. 
   Oto zrzut strony jego firmy: [Markdown]. 
   Napisz mocno spersonalizowane powitanie liczące maks. 3 zdania, nawiązując 
   do misji jego firmy."
6. SendGrid (API) -> Wyślij spersonalizowanego maila.</code></pre>
          <p>Koszt operacji: 0.003$ za tokeny GPT-4o-mini. Czas wykonania 2 sekundy. Wynik konwersji w dziale Marketingu rośnie wykładniczo.</p>
        `
      }
    ],
    quizzes: [
      {
        question: "Czym jest architektura DAG, powszechnie używana w systemach takich jak N8N?",
        options: ["Dynamic Application Gateway - bramka do autoryzacji tokenów", "Directed Acyclic Graph - graficzna reprezentacja zadań wykonywanych w jednym kierunku, bez nieskończonych pętli", "Data Analytics Group - zbiór specjalistów analizujących logi marketingowe", "Distributed Algorithmic Generation - technika rozproszonego generowania obrazów"],
        correct: 1
      }
    ]
  },
  {
    id: 'l7',
    title: 'Business Impact & Inżynieria Rynku',
    category: 'Mindset',
    color: '#9CCC65',
    icon: 'Rocket',
    concepts: [
      {
        term: 'The Art of Killing Ideas (Koszt Utopionych Opcji)',
        explanation: `
          <h3>Ekonomia Behawioralna: Sunk Cost Fallacy (Efekt utopionych kosztów)</h3>
          <p>Zbudowanie prototypu w 3 dni za pomocą Vercel i v0 jest niesamowite technicznie. Ale najważniejsza umiejętność "Seniora Produktowego" wywodzi się z ekonomii. Jeśli napisałeś kod do generowania avatara AI, spędziłeś nad architekturą tydzień, ale testy na żywo z użytkownikami (A/B testing) wykazują konwersję na poziomie 0.01% - co robisz?</p>
          <p>Słaby programista będzie go optymalizował i dodawał feature'y, broniąc go, bo "poświęcił na niego czas". Topowy inżynier rozumie matematykę zwrotu z inwestycji (ROI). Utylizuje projekt (kasuje kod) bez sentymentów i przesuwa kapitał czasu na nowy prototyp. Twój kod nie jest dziełem sztuki. Jest narządziem, by testować rynkowe hipotezy P(H|E) - twierdzenie Bayesa w praktyce startupu.</p>
        `
      },
      {
        term: 'Agile vs Waterfall - Matematyka Kosztu Porażki',
        explanation: `
          <h3>Pochodna Czasu i Optymalizacja Strat</h3>
          <p>Dlaczego w profilu rekrutacyjnym oczekuje się, że będziesz budował "od pomysłu do działającego rozwiązania w kilka dni bez trzymania za rękę"? Ponieważ koszt porażki jest zdefiniowany funkcją wykładniczą od czasu. <code>Koszt(t) = C * e^(k*t)</code>. Jeśli budujesz coś przez 3 miesiące (Waterfall), a rynek tego nie chce, straciłeś setki tysięcy dolarów. Jeśli zbudujesz MVP w 3 dni (Next.js server actions, v0 UI, LLM wrapper), rynek to odrzuci - tracisz tylko weekend pracy.</p>
          
          <h3>Praca z "Non-Technical People"</h3>
          <p>Tłumaczysz zjawiska techniczne przez pryzmat jednostek biznesowych (KPI). Zamiast mówić: "Zrefaktoryzowałem Context API na Zustand i wyciąłem bibliotekę moment.js by zmniejszyć bundle", mówisz: "Skróciłem czas ładowania TTI strony o 4 sekundy, co powinno podnieść naszą zdolność konwersji (Bounce Rate z Analytics) o 15% według estymat branżowych".</p>
        `
      }
    ],
    quizzes: [
      {
        question: "Zjawisko 'Sunk Cost Fallacy' w inżynierii AI oznacza:",
        options: ["Błąd API spowodowany zbyt dużą liczbą tokenów", "Kontynuowanie bezużytecznego projektu tylko dlatego, że zainwestowano już w niego mnóstwo czasu i pracy", "Przepełnienie pamięci RAM przez wyciek pamięci w Node.js", "Zbyt szybkie porzucanie projektów na etapie pomysłu, bez ich zakodowania"],
        correct: 1
      }
    ]
  },
  {
    id: 'l8',
    title: 'Krajobraz Modeli AI (2026)',
    category: 'AI Landscape',
    color: '#F48FB1',
    icon: 'Brain',
    concepts: [
      {
        term: 'The "Thinking" Meta - Obliczenia w czasie testu',
        explanation: `
          <h3>Fizyka: Energia Potencjalna i Przesunięcie Ku Przyszłości</h3>
          <p>W 2026 roku paradygmat tworzenia modeli przesunął się z "im większy model, tym lepszy" na <strong>Test-Time Compute</strong> (tzw. "Thinking models"). Zamiast natychmiastowo zgadywać kolejny token (reakcja bezwładnościowa), model "myśli" przed odpowiedzią. W fizyce to jak różnica między rzutem ukośnym a rakietą manewrującą, która spala paliwo w trakcie lotu by korygować trajektorię.</p>
          
          <h3>Matematyka: Drzewa Monte Carlo (MCTS)</h3>
          <p>Pod spodem proces "myślenia" to najczęściej <em>Monte Carlo Tree Search</em> (lub podobne algorytmy przeszukiwania drzew decyzyjnych). Model eksploruje setki możliwych ścieżek rozwiązania, ocenia je własnym modelem nagrody (Reward Model) i wraca (backtracking), jeśli wykryje błąd logiczny. Koszt obliczeniowy rośnie wykładniczo <code>O(b^d)</code> (gdzie b to branch factor, d to głębokość), co tłumaczy dlaczego generowanie odpowiedzi trwa kilkadziesiąt sekund, ale jej poprawność w kodowaniu skacze z 60% na 95%.</p>
          
          <h3>Implementacja: Kiedy używać?</h3>
          <p>Modeli typu "Thinking" (np. otwarty GLM-4.7 Thinking) używamy <strong>WYŁĄCZNIE</strong> do skomplikowanej logiki matematycznej lub architektonicznej (np. zaimplementuj algorytm A*). Nie używamy ich do pisania tekstów marketingowych czy generowania komponentów UI, bo to strata pieniędzy na farmy GPU.</p>
        `
      },
      {
        term: 'Giganci Kodu: Claude Opus 4.7 vs Gemini 3.1 Pro',
        explanation: `
          <h3>Algorytmika: Architekci kontra Agenci</h3>
          <p>Krajobraz w 2026 roku zdominowany jest przez specjalizację, a nie jeden "model do wszystkiego".</p>
          <ul>
            <li><strong>Claude Opus 4.7 (Anthropic):</strong> Niekwestionowany król <em>Architectural Reasoning</em>. Jego okno kontekstowe to absolutny cud inżynierii (prawie zerowa degradacja "Needle in a Haystack" powyżej 500k tokenów). Używasz go, gdy musisz zrefaktoryzować 50 plików na raz i przepisać architekturę bazy danych. Zauważa błędy logiczne, których nie widzi linter.</li>
            <li><strong>Gemini 3.1 Pro (Google):</strong> Gigant benchmarków agentowych (np. LiveCodeBench). Jeśli dasz mu dostęp do terminala (Agentic Coding), Gemini rozwiązuje zadania programistyczne bez Twojej pomocy. Dodatkowo niszczy konkurencję w tworzeniu UI, ponieważ jego algorytmy multimodalne (obraz-do-kodu) są zoptymalizowane pod szybki rendering.</li>
          </ul>
        `
      },
      {
        term: 'Wół roboczy i Open-Weight: GPT-5.4 & Qwen2.5-Coder',
        explanation: `
          <h3>Ekonomia Skali i Koszt Marginalny</h3>
          <p>Modele z górnej półki są drogie (np. 15$ za 1M tokenów wejściowych). Prawdziwy Senior potrafi użyć koncepcji <strong>Kaskadowania (Model Cascading)</strong>.</p>
          
          <h3>Praktyka: Routing modeli (Ollama i vLLM)</h3>
          <p><strong>GPT-5.4</strong> to najlepsze narzędzie typu "Szwajcarski Scyzoryk". Używasz go jako dyrygenta w architekturze agentowej – to on decyduje, jakie API wywołać, generuje plan i przekazuje zadania pomniejszym modelom.</p>
          <p>Jednakże, jeśli potrzebujesz przetwarzać setki tysięcy logów tekstowych dziennie, wywoływanie OpenAI zrujnuje budżet firmy. Tutaj wkraczają modele <strong>Open-Weight (jak Qwen2.5-Coder)</strong>. Mają one tylko 7 do 32 miliardów parametrów, ale są wybitnie wytrenowane (Fine-tuned) na gigabajtach czystego kodu. Możesz zhostować Qwen2.5-Coder na swoim własnym serwerze wektorowym (przy użyciu silnika vLLM lub popularnej aplikacji Ollama) za dosłownie kilkanaście centów za milion tokenów energii elektrycznej. Własny host daje Ci zerowe opóźnienia i absolutny brak naruszeń obostrzeń RODO/GDPR, bo wrażliwy kod nigdy nie opuszcza sprzętu Twojej firmy.</p>
        `
      }
    ],
    quizzes: [
      {
        question: "Czym charakteryzuje się meta 'Thinking models' z 2026 roku?",
        options: ["Są to modele generujące wyłącznie obrazy na podstawie myśli", "Zwracają odpowiedź natychmiastowo, by zredukować Time-To-First-Byte", "Wykonują obliczenia w czasie testu (Test-Time Compute), używając algorytmów takich jak MCTS do korekty własnych błędów przed pokazaniem odpowiedzi", "Są to modele przestarzałe, zastąpione przez proste algorytmy if-else"],
        correct: 2
      },
      {
        question: "Jeśli Twoja aplikacja do analizy kodu uruchamia się lokalnie (na własnym serwerze w firmie z powodu obostrzeń RODO), który model najlepiej wykorzystać?",
        options: ["Tylko i wyłącznie najdroższego Claude Opus 4.7 przez API z USA", "Model Open-Weight, jak Qwen2.5-Coder, hostowany lokalnie za pomocą np. Ollamy/vLLM", "Google Gemini 3.1 Pro z wyłączonymi zabezpieczeniami", "Żaden, ponieważ sztuczna inteligencja nie może działać bez połączenia z chmurą"],
        correct: 1
      }
    ]
  },
  {
    id: 'l9',
    title: 'Architektura Agentowa: Autonomia Systemów',
    category: 'Advanced Workflow',
    color: '#00E676',
    icon: 'Brain',
    concepts: [
      {
        term: 'Koncepcja Systemów Multi-Agentowych',
        explanation: `
          <h3>Biologia Syntetyczna i Rój (Swarm Intelligence)</h3>
          <p>Tradycyjny skrypt to liniowa pętla z twardymi warunkami IF/ELSE. W roku 2026 w budowaniu inteligentnych apek przeważają systemy agentowe. Wyobraź sobie to jako mrowisko, gdzie poszczególne mrówki (agenci) komunikują się między sobą. Mamy Model Dyrygujący (Orchestrator) oraz Modele Pracownicze (Workers).</p>
          
          <h3>Matematyka Agenta: Pętla OODA</h3>
          <p>Agent AI funkcjonuje w pętli <strong>Observe -> Orient -> Decide -> Act</strong>. Podajesz mu cel wysokiego poziomu (np. "Napisz grę w Węża"). Agent:
          <ol>
            <li><strong>Rozumowanie:</strong> Tworzy plan architektoniczny (dzieli to na 5 zadań).</li>
            <li><strong>Użycie Narzędzi (Tool Use):</strong> Przeszukuje Web (żeby poznać najnowsze standardy Canvas API), uruchamia CLI polecenie by stworzyć projekt (<code>npx vite</code>).</li>
            <li><strong>Korekta Błędów:</strong> Jeśli kod zwróci błąd, wysyła sam do siebie logi z konsoli, by naprawić usterkę. Pracuje iteracyjnie bez udziału człowieka.</li>
          </ol></p>
        `
      },
      {
        term: 'Semantic Routing i Fallbacki',
        explanation: `
          <h3>Teoria Sterowania: Filtrowanie Sygnału</h3>
          <p>Kiedy używamy agentów na produkcji, nie wszystko musi być wysyłane do najdroższego modelu. Semantic Routing to sieć neuronowa (zazwyczaj ekstremalnie szybki, jednowarstwowy klasyfikator Embeddingów), która czyta zapytanie użytkownika w ułamek sekundy i mówi:</p>
          <blockquote>"Aha, on pyta o zmianę hasła. Kieruję to zapytanie do małego modelu Llama-3-8B (koszt = $0.0001)."</blockquote>
          <p>Z kolei jeśli użytkownik zapyta: "Przeanalizuj mi to 500-stronicowe sprawozdanie finansowe", Router Semantyczny prześle to do Claude 4.7 (koszt = $2.00).</p>
          <p>Jest to esencja nowoczesnej architektury Software Engineeringu w epoce LLM – minimalizowanie opóźnień (Latencji) i drastyczne oszczędzanie pieniędzy.</p>
        `
      }
    ],
    quizzes: [
      {
        question: "Na czym polega pętla OODA w systemach Agentowych AI?",
        options: ["Object Oriented Data Access - dostęp do baz danych przez ORM", "Observe, Orient, Decide, Act - pętla pozwalająca agentowi na dynamiczną korektę swojego planu w trakcie rozwiązywania problemu", "Over Optimization During AI - błąd polegający na przetrenowaniu modelu", "Online Output Direct Action - natychmiastowe wypisanie wyniku do HTML"],
        correct: 1
      }
    ]
  }
];
