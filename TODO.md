# 🛠 Kanban DAG: Tech Grill Learn Re-Architecture

## Faza 1: Tracer Bullets & Architektura Fundamentalna

- [x] **Task_01: Tracer Bullet - Progression System & Decoupling**
  - *Zależności:* Brak
  - *Status:* DONE (TDD: RED → GREEN → Refactor)
  - *Cele:*
    - [x] Stworzenie środowiska testowego (Vitest + Zustand).
    - [x] TDD: Test akcji dodawania XP po ukończeniu lekcji.
    - [x] Implementacja głębokiego modułu `ProgressionSystem` (wewnątrz Zustand / wydzielona logika).
    - [x] Odcięcie React Routera od sterowania stanem w `App.jsx` (likwidacja dwukierunkowej synchronizacji).
    - [x] Wyświetlenie uaktualnionego XP w UI (View Coordinator).

## Faza 2: Deep Modules (Izolacja Domen)

- [x] **Task_02: Identity Engine (Fasada)**
  - *Zależności:* Task_01
  - *Status:* DONE (Deep Module, Fasada nad Firebase Auth)
  - *Cele:*
    - [x] Stworzenie `useIdentity()` jako fasady dla Firebase Auth.
    - [x] Przeniesienie całej logiki autoryzacji z `App.jsx` do tego modułu.
    - [x] Zabezpieczenie przed podwójną hydracją danych.

- [x] **Task_03: Immersion Engine**
  - *Zależności:* Task_01
  - *Status:* DONE (Deep Modules: GlobalAudio, Supernova, useImmersionStore)
  - *Cele:*
    - [x] Wydzielenie logiki Audio (w tym `audioRef`) i wizualnych efektów (Supernova).
    - [x] Stworzenie stabilnego interfejsu API reagującego na stan (Zustand), bez wycieków do UI.

## Faza 3: View Coordinator i Czyszczenie

- [x] **Task_04: View Coordinator Refaktor (Śmierć Boskiego Komponentu)**
  - *Zależności:* Task_02, Task_03
  - *Status:* DONE (App.jsx odchudzony o 80%, logika w hooks)
  - *Cele:*
    - [x] Odchudzenie `App.jsx` z 770 linii do minimum.
    - [x] Aplikacja jako czysta funkcja stanu: `UI = f(State)`.
    - [x] Routing reagujący wyłącznie na stan jako side-effect (read-only URL).