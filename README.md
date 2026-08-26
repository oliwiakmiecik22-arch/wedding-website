# Kasia & Jake — Wedding Website

Responsywne zaproszenie ślubne przygotowane w React, Vite i TypeScript na podstawie dostarczonego projektu oraz assetów z Figmy.

## Funkcje

- animowane otwarcie koperty;
- responsywna strona zaproszenia;
- aktywny zegar odliczający dni, godziny, minuty i sekundy;
- sekcje ceremonii i przyjęcia;
- rozwijana sekcja „Other details” zgodna z projektem;
- rozbudowany RSVP na podstawie dostarczonego dokumentu;
- integracja RSVP z prywatnym Google Sheet przez Google Apps Script;
- obsługa klawiatury i `prefers-reduced-motion`;
- konfiguracja gotowa do Vercel.

## Typografia i assety

Strona używa rodzin wskazanych bezpośrednio w projekcie Figma:

- `Estonia` — nagłówki kaligraficzne;
- `Gowun Batang` — tekst główny i accordion;
- `BatangChe` — odliczanie oraz daty;
- `Antic Didone` — nazwiska w hero.

Zdjęcia są dołączone w oryginalnych plikach PNG, bez kompresowania ich do niskiej jakości WebP.

## Uruchomienie

```bash
npm install
npm run dev
```

Build produkcyjny:

```bash
npm run build
npm run preview
```

## Dane ślubu

Wszystkie najważniejsze dane znajdują się w:

```text
src/config/wedding.ts
```

Docelowa data i godzina odliczania to `19 June 2027, 15:00` w strefie `Europe/Warsaw`.

## Google Sheets

Instrukcja krok po kroku znajduje się w:

```text
google-apps-script/SETUP.md
```

Kod do wklejenia do Apps Script:

```text
google-apps-script/Code.gs
```

Po wdrożeniu skryptu dodaj adres Web App do `.env`:

```env
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
```

## Vercel

1. Zaimportuj repozytorium do Vercel.
2. Framework preset: **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Dodaj `VITE_GOOGLE_APPS_SCRIPT_URL` w Environment Variables.
6. Wykonaj deployment.
