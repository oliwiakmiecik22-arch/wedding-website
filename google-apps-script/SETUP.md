# Połączenie RSVP z Google Sheets

Integracja nie wymaga publikowania arkusza ani dodawania danych logowania Google do strony.
Formularz wysyła odpowiedzi do Google Apps Script, a skrypt dopisuje je do prywatnego arkusza.

## 1. Utwórz arkusz

1. Otwórz [Google Sheets](https://sheets.google.com).
2. Utwórz pusty arkusz.
3. Nazwij go np. `Kasia & Jake — Wedding RSVP`.
4. Nie musisz tworzyć zakładki ani nagłówków — skrypt zrobi to automatycznie.

## 2. Dodaj Apps Script

1. W arkuszu wybierz **Extensions → Apps Script**.
2. Usuń przykładową funkcję z pliku `Code.gs`.
3. Skopiuj całą zawartość pliku `google-apps-script/Code.gs` z tego projektu.
4. Wklej ją do edytora Apps Script.
5. Kliknij **Save**.

Jeżeli skrypt został otwarty bezpośrednio z arkusza przez **Extensions → Apps Script**, nie musisz podawać ID arkusza.

### Opcjonalne ustawienie ID arkusza

Jeśli Apps Script nie został utworzony z poziomu arkusza:

1. Skopiuj ID z adresu arkusza. Jest to część pomiędzy `/d/` i `/edit`.
2. W Apps Script otwórz **Project Settings**.
3. W sekcji **Script Properties** dodaj właściwość:
   - Property: `SPREADSHEET_ID`
   - Value: skopiowane ID arkusza.

## 3. Wdróż jako Web App

1. Kliknij **Deploy → New deployment**.
2. Przy **Select type** wybierz **Web app**.
3. Ustaw opis, np. `Wedding RSVP v1`.
4. Przy **Execute as** wybierz **Me**.
5. Przy **Who has access** wybierz **Anyone**.
6. Kliknij **Deploy**.
7. Przy pierwszym wdrożeniu Google poprosi o autoryzację dostępu do arkusza. Zatwierdź ją na swoim koncie.
8. Skopiuj adres kończący się na `/exec`. To jest adres Web App.

Wybranie opcji **Anyone** nie upublicznia zawartości arkusza. Pozwala jedynie wysłać odpowiedź do skryptu. Sam arkusz pozostaje prywatny.

## 4. Połącz stronę lokalnie

1. W głównym katalogu projektu skopiuj `.env.example` jako `.env`.
2. Wklej adres Web App:

```env
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/TWOJ_DEPLOYMENT_ID/exec
```

3. Uruchom ponownie serwer po każdej zmianie `.env`:

```bash
npm run dev
```

Zmienne zaczynające się od `VITE_` są dołączane w czasie budowania. Adres Web App nie jest hasłem, ale w kodzie klienta nigdy nie umieszczaj danych logowania, prywatnych kluczy ani adresu edycji arkusza.

## 5. Połącz stronę na Vercel

1. Otwórz projekt w Vercel.
2. Przejdź do **Settings → Environment Variables**.
3. Dodaj:
   - Name: `VITE_GOOGLE_APPS_SCRIPT_URL`
   - Value: adres Web App kończący się na `/exec`.
4. Zaznacz **Production**, **Preview** i **Development**, jeśli formularz ma działać we wszystkich środowiskach.
5. Zapisz zmienną.
6. Wykonaj ponowne wdrożenie projektu. Stary build nie otrzyma nowej wartości automatycznie.

## 6. Przetestuj

1. Otwórz stronę.
2. Przejdź do RSVP.
3. Wypełnij formularz testowymi danymi i wyślij go jeden raz.
4. Otwórz arkusz.
5. Powinna pojawić się zakładka `RSVP`, nagłówki i nowy wiersz.
6. Usuń testowy wiersz po sprawdzeniu.

Jeśli strona pokazuje komunikat, że RSVP nie jest podłączone, sprawdź nazwę zmiennej i uruchom nowy build.

## 7. Aktualizacja skryptu

Po zmianie `Code.gs`:

1. Kliknij **Deploy → Manage deployments**.
2. Kliknij ikonę ołówka przy aktywnym wdrożeniu.
3. Wybierz **New version**.
4. Kliknij **Deploy**.

Nie twórz za każdym razem zupełnie nowego wdrożenia, ponieważ zmieniłby się adres `/exec` i trzeba byłoby ponownie ustawić zmienną w Vercel.

## Ważne ograniczenie techniczne

Frontend korzysta z trybu `no-cors`, ponieważ Google Apps Script odpowiada przez przekierowanie między domenami. Strona może potwierdzić, że żądanie zostało wysłane, ale ostatecznym testem integracji jest pojawienie się rzeczywistego wiersza w arkuszu.
