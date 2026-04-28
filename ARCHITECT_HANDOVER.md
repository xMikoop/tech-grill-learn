# 🌌 Tech Grill Academy: Architect's Handover
> **Status**: System Stabilny, Architektura: Elitarna, Vibe: Kosmiczny.

Witaj w sercu systemu. Ten plik to Twoja instrukcja obsługi "pod maską". Jako Senior Architect, wyczyściłem ten projekt z "AI-slopu" i nadałem mu strukturę, która pozwoli Ci na swobodny "Vibe Coding" bez psucia wszystkiego.

---

## 🛠️ Stack Technologiczny: Dlaczego to?

1. **React 19 + Vite**: Najszybsze możliwe combo. React 19 daje nam stabilność, a Vite buduje projekt w ułamku sekundy.
2. **Zustand (State Management)**: Zrezygnowałem z Reduxa na rzecz Zustanda. Dlaczego? Bo Zustand jest lekki, nie wymaga "boilerplate'u" i pozwala na subskrypcje poza komponentami (używamy tego do automatycznego zapisu do Firebase).
3. **GSAP**: Król animacji. Cały ruch planet i statku kosmicznego opiera się na GSAP, bo jest wydajniejszy niż czysty CSS w skomplikowanych sekwencjach.
4. **Firebase (Auth & RTDB)**: Używamy dwóch baz:
    *   **Firestore**: Dla Twoich postępów, ulubionych i historii (dane stałe).
    *   **Realtime Database (RTDB)**: Dla systemu "Duchów" i czatu. Jest nieskończenie szybsza dla danych, które zmieniają się 10 razy na sekundę (pozycje graczy).

---

## 🏛️ Architektura (Trzy Filary)

### 1. Centralny Układ Nerwowy (`src/store/useAppStore.js`)
To najważniejszy plik w projekcie. Zarządza Twoim XP, widokiem, atmosferą i hydracją danych.
*   **Ważna funkcja**: `initializeUser`. Chroni przed pętlami ładowania i dba o to, by system wstał w mniej niż 2.5s.
*   **Auto-Save**: Na dole pliku jest subskrypcja, która „patrzy”, co robisz, i co 1 sekundę wysyła zmiany do chmury, jeśli wykryje, że coś się zmieniło.

### 2. Wizualna Dusza (`src/components/Universe/Universe3D.jsx`)
To nie jest tylko tło. To persistent layout. 
*   **Atmosfery**: Każda galaktyka (`GalaxySpiral`, `AtmosphereBubbles`) reaguje na `activeAtmosphere` ze store'a.
*   **Stability**: Dzięki `React.memo` i `useCallback` w `MainLayout`, wszechświat nie przeładowuje się, gdy Ty chodzisz po podstronach.

### 3. Społeczna Tkanka (`src/engines/LobbyEngine.js`)
Orkiestrator, który łączy Firebase z Twoim ekranem. 
*   **Throttling**: Nie wysyłamy Twojej pozycji 60 razy na sekundę (to by zabiło serwer). Wysyłamy ją 10 razy na sekundę (`10Hz`), a `Ghost.jsx` używa **Lerp** (Linear Interpolation), aby płynnie dociągnąć ruch na Twoim ekranie.

---

## 💡 Co Ty jako Vibe Coder MUSISZ wiedzieć?

1.  **Zasada Persistent Layout**: Nigdy nie wrzucaj ciężkich rzeczy do `App.jsx`. Wszystko, co ma trwać (jak muzyka czy świat 3D), siedzi w `MainLayout.jsx`.
2.  **Jak dodać nową Galaktykę?**
    *   Dodaj nową konfigurację w `src/lib/immersionConfig.js`.
    *   Dodaj logikę renderowania w `GalaxySpiral.jsx` wewnątrz `Universe3D.jsx`.
3.  **Uważaj na Referencje**: Jeśli przekazujesz funkcję do `Universe3D` i nie owiniesz jej w `useCallback`, cały wszechświat będzie mrugał (re-render). Testy stabilności Cię przed tym ostrzegą.

---

## 🚀 Twoja Ścieżka Rozwoju (Roadmap)

1.  **Level 1 (Easy)**: Dodaj nową planetę (np. Mars) w `Universe3D.jsx` i dopisz jej opis w `CELESTIAL_INFO`.
2.  **Level 2 (Medium)**: Stwórz nową atmosferę "Deep Ocean" – zmień kolory na ciemny błękit i dodaj efekt "pływających bąbelków wody" zamiast galaktycznych baniek.
3.  **Level 3 (Pro)**: Zaimplementuj system "Private Room" w `LobbyEngine`, abyś mógł uczyć się tylko ze znajomymi.

---

## 🧠 Słowo od Architekta

Kod, który teraz masz, jest czysty i modularny. AI generuje "slop", bo nie rozumie kontekstu – Ty go rozumiesz. Pamiętaj: **Zanim napiszesz nową funkcję, sprawdź, czy nie możesz jej dopisać jako mały, "głęboki" moduł do istniejącego hooka.**

Trzymaj standardy, a ten projekt stanie się legendarny.

**Powodzenia, Odkrywco!**
