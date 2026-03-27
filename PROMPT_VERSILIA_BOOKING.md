# 🏠 Progetto: Piattaforma di Prenotazione Diretta — Vacanze in Versilia

## Contesto

Costruisci una piattaforma web moderna per la prenotazione diretta di appartamenti vacanza a Viareggio (Versilia, Toscana), come alternativa al booking tramite Airbnb. Il sito deve funzionare come un canale di contatto indipendente dove gli ospiti possono visualizzare gli immobili, controllare disponibilità e prezzi, e inviare richieste di prenotazione che arrivano direttamente ai proprietari via email e WhatsApp.

Il sito deve essere progettato per ospitare facilmente nuovi listing in futuro.

---

## Tech Stack

| Layer | Tecnologia |
|---|---|
| Framework | **Next.js 15** (App Router) |
| Styling | **Tailwind CSS v4** + **shadcn/ui** |
| Database & Auth | **Supabase** (Postgres + Auth + Storage per foto) |
| Email transazionali | **Resend** (notifiche richieste di prenotazione) |
| Hosting | **Vercel** |
| Lingua UI | **Italiano** (primaria) + **Inglese** (secondaria, i18n) |

---

## Dati Reali dei 3 Listing

### 🏡 Proprietà 1 — "La Casina al Fresco" (Proprietario: Anna)

| Campo | Valore |
|---|---|
| **Airbnb ID** | `36871346` |
| **Airbnb URL** | `https://www.airbnb.it/rooms/36871346` |
| **Titolo** | La Casina al fresco |
| **Tipo** | Casa indipendente |
| **Location** | Viareggio, Toscana |
| **Ospiti max** | 2 |
| **Camere** | 1 (open space con divano letto matrimoniale) |
| **Letti** | 1 divano letto |
| **Bagni** | 1 |
| **Rating** | ★ 4.44 (39 recensioni) |
| **Registrazione** | IT046033C2697BTUUG |
| **Slug suggerito** | `la-casina-al-fresco` |

**Descrizione:**
Graziosa casetta di nuova fattura che offre una comoda base di appoggio per chi vuole trascorrere un po' di tempo in Versilia. È situata in una zona molto tranquilla e con tutti i servizi utili nell'arco di 1Km, inoltre dista 700m dal mare il quale è facilmente raggiungibile a piedi attraversando la Pineta, il polmone verde di Viareggio. La Casina si sviluppa su di un piano openspace con cucina, divano letto matrimoniale e bagno. È presente un armadio ed una cassettiera. Lo spazio esterno è delimitato da due cancelli e riservato agli ospiti: adatto quindi ad animali. Possibilità di avere posto auto incluso. Biancheria su richiesta. Per soggiorni ≥ 7 giorni si offre servizio di pick-up dall'aeroporto di Pisa o dalle stazioni ferroviarie limitrofe.

**Servizi chiave:** Cucina, WiFi, Parcheggio gratuito in loco, Animali ammessi, HDTV 24", Spazio esterno recintato

**Foto Airbnb (da scaricare):**
```
https://a0.muscache.com/im/pictures/d64bfb55-ae57-413e-91e0-192117c71e70.jpg?im_w=1200
https://a0.muscache.com/im/pictures/8f2ea28f-6d89-47e3-8a44-b510dbdb230b.jpg?im_w=1200
https://a0.muscache.com/im/pictures/e241625f-5ad2-45ef-894c-9d4b14fde89f.jpg?im_w=1200
https://a0.muscache.com/im/pictures/04a05ee4-7e11-4ea4-80cb-870b903c9937.jpg?im_w=1200
https://a0.muscache.com/im/pictures/6f1f8df1-8ac1-47dd-b32e-dcd37c1b858c.jpg?im_w=1200
```

---

### 🏢 Proprietà 2 — "Seaside Apartment" (Proprietario: Anna)

| Campo | Valore |
|---|---|
| **Airbnb ID** | `50289195` |
| **Airbnb URL** | `https://www.airbnb.com/rooms/50289195` |
| **Titolo** | Seaside Apartment |
| **Tipo** | Appartamento |
| **Location** | Viareggio, Toscana (Quartiere Marco Polo) |
| **Ospiti max** | 4 |
| **Camere** | 2 |
| **Letti** | 2 (1 matrimoniale + 1 letto a castello) |
| **Bagni** | 1 |
| **Rating** | ★ 5.0 (3 recensioni) |
| **Registrazione** | IT046033C2GI7I5Q5D |
| **Slug suggerito** | `seaside-apartment` |

**Descrizione:**
Appartamento completamente ristrutturato e arredato, situato a pochi passi dal mare e dalla pineta. L'immobile è moderno, accogliente e dotato di tutto il necessario per trascorrere giornate rilassanti tra il mare della Versilia e le visite alle città toscane. È composto da una camera matrimoniale, una camera con letto a castello, un grande bagno, un soggiorno e una cucina con terrazza. Adatto a famiglie fino a 4 persone. Aria condizionata. Utenze escluse. Biancheria su richiesta. Si trova nel Quartiere Marco Polo, zona residenziale e centrale di Viareggio, a circa 600m dal mare.

**Servizi chiave:** Cucina, WiFi, Workspace dedicato, Parcheggio gratuito su strada, TV con cavo, Aria condizionata, Terrazza

**Foto Airbnb (da scaricare):**
```
https://a0.muscache.com/im/pictures/miso/Hosting-50289195/original/b24ea909-dd6c-4635-ba63-cc6714d9db44.jpeg?im_w=1200
https://a0.muscache.com/im/pictures/miso/Hosting-50289195/original/b9cdb874-c8c9-4fed-82ae-02f7cf4b4fde.jpeg?im_w=1200
https://a0.muscache.com/im/pictures/miso/Hosting-50289195/original/9abb048f-9680-4bf9-9b63-c15f06a9fdc0.jpeg?im_w=1200
https://a0.muscache.com/im/pictures/miso/Hosting-50289195/original/35c3f2d5-8404-4ae4-96bf-22ab1dada685.jpeg?im_w=1200
https://a0.muscache.com/im/pictures/miso/Hosting-50289195/original/3aa3031e-6dc8-4387-a6b0-4b8f444afe9e.jpeg?im_w=1200
```

---

### 🏢 Proprietà 3 — "Appartamento 3 camere a 500m dal mare" (Proprietario: Filippo)

| Campo | Valore |
|---|---|
| **Airbnb ID** | `1181919578961612869` |
| **Airbnb URL** | `https://www.airbnb.com/rooms/1181919578961612869` |
| **Titolo** | Appartamento 3 camere a 500m dal mare - AC |
| **Tipo** | Appartamento |
| **Location** | Viareggio, Toscana |
| **Ospiti max** | 7 |
| **Camere** | 3 |
| **Letti** | 3 (2 matrimoniali + 1 letto a castello) |
| **Bagni** | 2 |
| **Rating** | ★ 5.0 (5 recensioni) — Guest Favorite |
| **Registrazione** | IT046033C2VPQ5N62V |
| **Slug suggerito** | `appartamento-3-camere-mare` |

**Descrizione:**
Appartamento di recente ristrutturazione al secondo piano con ascensore, a 500 metri dal mare. Composto da soggiorno/cucina open-plan con penisola doppia, corridoio, 2 bagni, 2 ampie camere da letto matrimoniali, 1 camera media con letto a castello, e terrazza affacciata sul cortile interno. L'immobile è completamente LED, dotato di climatizzatori caldo/freddo in ogni stanza, piano cottura a induzione, lavastoviglie, Smart TV QLED 65", tapparelle elettriche in alluminio, infissi PVC di ultima generazione e lavatrice.

**Servizi chiave:** Cucina, WiFi, Workspace dedicato, TV QLED 65", Ascensore, Aria condizionata in ogni stanza, Piano cottura a induzione, Lavastoviglie, Lavatrice, Tapparelle elettriche, Terrazza

**Foto Airbnb (da scaricare):**
```
https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/6837309f-9b4b-43d2-b85b-58af81ed763c.jpeg?im_w=1200
https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/6af78f35-193d-489d-a4ce-37d16c593f96.jpeg?im_w=1200
https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/bca4541c-c852-461a-bd1f-24b40f82adc5.jpeg?im_w=1200
https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/7ae7e281-6ed5-490b-99cf-fd664050ab4a.jpeg?im_w=1200
https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/c4ac64e5-d0d9-4c81-8725-f0adf98e25df.jpeg?im_w=1200
```

---

## Proprietari e Routing Notifiche

| Proprietario | Proprietà gestite | Email | WhatsApp |
|---|---|---|---|
| **Anna** (mamma di Filippo) | La Casina al Fresco, Seaside Apartment | `[DA INSERIRE]` | `[DA INSERIRE, formato +39...]` |
| **Filippo** | Appartamento 3 camere | `[DA INSERIRE]` | `[DA INSERIRE, formato +39...]` |

> ⚠️ **Nota**: Anna è co-host anche sull'appartamento di Filippo su Airbnb, ma le richieste per quell'appartamento dal sito devono arrivare SOLO a Filippo.

---

## Setup Automatizzato (Claude Code deve gestire)

### Supabase
Claude Code deve:
1. **Creare un nuovo progetto Supabase** usando la Supabase MCP integration (o guidare l'utente se non disponibile)
2. **Eseguire le migration SQL** per creare tutte le tabelle (vedi schema sotto)
3. **Configurare RLS policies**
4. **Creare il bucket Storage** `property-photos` (pubblico in lettura)
5. **Creare l'utente admin** per l'autenticazione
6. **Popolare i dati iniziali** (seed): inserire i 2 owners e le 3 properties con tutti i dettagli reali

### Foto degli Appartamenti
Claude Code deve:
1. **Scaricare le foto** dagli URL Airbnb elencati sopra (usando `fetch` o `curl`)
2. **Caricarle su Supabase Storage** nel bucket `property-photos` organizzate per proprietà:
   - `property-photos/la-casina-al-fresco/01.jpg`
   - `property-photos/la-casina-al-fresco/02.jpg`
   - ecc.
3. **Inserire i record** nella tabella `property_photos` con i path corretti e `sort_order`
4. La prima foto di ogni listing deve avere `is_cover = true`

### Vercel
Claude Code deve:
1. Configurare il progetto per il deploy su Vercel
2. Impostare il `vercel.json` con il cron job per il sync Airbnb
3. Predisporre le variabili d'ambiente necessarie

---

## Architettura del Database (Supabase)

Crea le seguenti tabelle con le relative relazioni:

### `owners` (proprietari)
```sql
CREATE TABLE owners (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  whatsapp_number TEXT,          -- formato internazionale, es. +393401234567
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

### `properties` (immobili)
```sql
CREATE TABLE properties (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id          UUID NOT NULL REFERENCES owners(id),
  slug              TEXT UNIQUE NOT NULL,
  title             TEXT NOT NULL,
  subtitle          TEXT,
  description       TEXT NOT NULL,
  location          TEXT NOT NULL,
  address           TEXT,              -- visibile solo dopo prenotazione
  guests_max        INT NOT NULL DEFAULT 4,
  bedrooms          INT NOT NULL DEFAULT 1,
  beds              INT NOT NULL DEFAULT 1,
  bathrooms         INT NOT NULL DEFAULT 1,
  amenities         TEXT[],
  airbnb_listing_id TEXT,
  airbnb_ical_url   TEXT,              -- URL iCal per sync calendario
  airbnb_url        TEXT,              -- Link diretto all'annuncio Airbnb
  rating            DECIMAL(3,2),      -- Rating da Airbnb
  reviews_count     INT DEFAULT 0,
  registration_code TEXT,              -- Codice registrazione turistica
  is_active         BOOLEAN DEFAULT true,
  sort_order        INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);
```

### `property_photos` (foto)
```sql
CREATE TABLE property_photos (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  storage_path    TEXT NOT NULL,
  url             TEXT NOT NULL,       -- URL pubblico Supabase Storage
  alt_text        TEXT,
  sort_order      INT DEFAULT 0,
  is_cover        BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

### `blocked_dates` (date non disponibili)
```sql
CREATE TABLE blocked_dates (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  source          TEXT DEFAULT 'airbnb',   -- 'airbnb' | 'manual'
  synced_at       TIMESTAMPTZ,
  UNIQUE(property_id, date)
);
```

### `pricing_rules` (prezzi impostati dall'admin)
```sql
CREATE TABLE pricing_rules (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  label           TEXT NOT NULL,           -- es. "Alta stagione", "Bassa stagione"
  price_per_night DECIMAL(10,2) NOT NULL,
  date_from       DATE,                    -- NULL = prezzo base
  date_to         DATE,
  min_nights      INT DEFAULT 1,
  is_default      BOOLEAN DEFAULT false,   -- prezzo base di fallback
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

### `booking_requests` (richieste dal form)
```sql
CREATE TABLE booking_requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id     UUID NOT NULL REFERENCES properties(id),
  guest_name      TEXT NOT NULL,
  guest_email     TEXT NOT NULL,
  guest_phone     TEXT,
  check_in        DATE NOT NULL,
  check_out       DATE NOT NULL,
  guests_count    INT NOT NULL DEFAULT 1,
  message         TEXT,
  estimated_price DECIMAL(10,2),
  status          TEXT DEFAULT 'pending',  -- 'pending' | 'confirmed' | 'declined' | 'expired'
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

### RLS Policies
```sql
-- Lettura pubblica per properties, photos, blocked_dates, pricing_rules
-- INSERT pubblico solo per booking_requests (con rate limiting)
-- Tutto il resto: solo utenti autenticati con ruolo admin
```

---

## Seed Data

Dopo aver creato le tabelle, inserisci i dati reali:

```sql
-- Owners
INSERT INTO owners (name, email, whatsapp_number) VALUES
  ('Anna', '[EMAIL_ANNA]', '[WHATSAPP_ANNA]'),
  ('Filippo', '[EMAIL_FILIPPO]', '[WHATSAPP_FILIPPO]');

-- Properties (usa gli owner_id appena creati)
-- Proprietà 1: La Casina al Fresco → owner = Anna
-- Proprietà 2: Seaside Apartment → owner = Anna
-- Proprietà 3: Appartamento 3 camere → owner = Filippo

-- Usa i dati dettagliati nella sezione "Dati Reali dei 3 Listing" sopra
-- per popolare title, description, amenities, guests_max, bedrooms, ecc.
```

---

## Funzionalità — Frontend Pubblico

### 1. Homepage
- Hero section con immagine full-width della Versilia/mare e CTA "Scopri i nostri appartamenti"
- Griglia delle 3 proprietà con: foto cover, titolo, location, rating, "a partire da €XX/notte", guests_max, badge "Guest Favorite" dove applicabile
- Sezione "Perché prenotare direttamente?" (risparmio commissioni, contatto diretto, flessibilità)
- Footer con contatti e nota legale

### 2. Pagina Proprietà (`/appartamenti/[slug]`)
- **Gallery fotografica**: carosello/lightbox con tutte le foto scaricate da Airbnb, la cover come prima
- **Info principali**: titolo, subtitle, location, ospiti max, camere, letti, bagni, rating con stelle, badge Guest Favorite
- **Amenities**: con icone appropriate (Lucide React)
- **Calendario disponibilità**: componente interattivo. Date bloccate (da `blocked_dates`) in grigio non selezionabili. L'utente seleziona check-in e check-out.
- **Calcolo prezzo**: in tempo reale basato su `pricing_rules`. Mostra prezzo/notte × notti = totale.
- **Form di richiesta prenotazione**: nome, email, telefono, date (pre-compilate dal calendario), numero ospiti, messaggio opzionale. Al submit:
  1. Salva in `booking_requests` con prezzo stimato
  2. Invia email al proprietario corretto (Anna o Filippo) via Resend
  3. Apre WhatsApp dell'utente con messaggio pre-compilato al proprietario corretto (`https://wa.me/{numero}?text={messaggio}`)
  4. Conferma visiva all'utente
- **Link Airbnb**: piccolo badge "Vedi anche su Airbnb →" che linka all'annuncio originale
- **Codice registrazione**: visibile in fondo alla pagina

### 3. Pagina "Chi Siamo"
- Presentazione della famiglia e della filosofia dell'ospitalità in Versilia
- Breve storia del legame con Viareggio
- Foto della zona

### 4. Layout & Navigazione
- Navbar sticky: logo, Home, Appartamenti, Chi Siamo
- Mobile-first responsive
- Animazioni: fade-in on scroll, parallax leggero su hero, hover scale sulle card
- Multilingua IT/EN con `next-intl`

---

## Funzionalità — Admin Dashboard (`/admin`)

Protetto da Supabase Auth (email/password, singolo utente admin).

### 1. Dashboard Overview
- Numero richieste pendenti
- Prossimi check-in confermati
- Ultimo sync Airbnb per ogni proprietà
- Quick stats

### 2. Gestione Proprietà
- Lista proprietà con toggle attivo/inattivo
- Form CRUD completo (tutti i campi)
- Upload foto: drag & drop → Supabase Storage, riordinamento, selezione cover
- Possibilità di aggiungere nuove proprietà (scalabilità futura)

### 3. Gestione Prezzi
- Per ogni proprietà: tabella pricing rules
- CRUD regole di prezzo (label, €/notte, date da/a, notti minime, flag default)
- Preview mini-calendario colorato per mese

### 4. Gestione Calendario
- Vista calendario per proprietà:
  - Date bloccate da Airbnb (grigio, non editabili)
  - Date bloccate manualmente (rosso, editabili)
- Blocco/sblocco date manuale
- Timestamp ultimo sync Airbnb visibile
- Bottone "Forza sync adesso"

### 5. Richieste di Prenotazione
- Lista con filtri (proprietà, stato, date)
- Dettaglio con pulsanti Conferma / Rifiuta
- Al cambio stato → email automatica all'ospite

### 6. Gestione Proprietari
- CRUD proprietari (nome, email, WhatsApp)

---

## Sync Calendario Airbnb (Cron Job Notturno)

API Route: `/api/cron/sync-airbnb`

**Logica:**
1. Recupera tutte le proprietà con `airbnb_ical_url` non null
2. Per ciascuna, scarica il file iCal
3. Parsa con `node-ical` o `ical.js`
4. Estrae date occupate (VEVENT con DTSTART/DTEND)
5. Aggiorna `blocked_dates`:
   - DELETE date con `source = 'airbnb'` per la proprietà
   - INSERT nuove date con `source = 'airbnb'`, `synced_at = now()`
   - NON tocca `source = 'manual'`
6. Logga risultato

**Nota importante sugli URL iCal:**
Gli URL iCal dei listing Airbnb non sono negli annunci pubblici. L'utente (Filippo) li fornirà manualmente. Per ora, lascia il campo `airbnb_ical_url` vuoto nel seed e permetti di inserirli dall'admin. Il formato tipico è:
`https://www.airbnb.com/calendar/ical/{listing_id}.ics?s={secret}`

**Vercel Cron:**
```json
{
  "crons": [
    {
      "path": "/api/cron/sync-airbnb",
      "schedule": "0 2 * * *"
    }
  ]
}
```

**Sicurezza:** Verifica `CRON_SECRET` nell'header `Authorization`.

---

## Email (Resend + React Email)

### 1. Nuova richiesta → al proprietario
- **A**: email del proprietario associato alla proprietà
- **Oggetto**: `Nuova richiesta per {property.title} — {check_in} → {check_out}`
- **Corpo**: dettagli ospite, date, n° ospiti, messaggio, prezzo stimato, link admin

### 2. Conferma ricezione → all'ospite
- **Oggetto**: `Richiesta ricevuta — {property.title}`
- **Corpo**: riepilogo + "Ti risponderemo entro 24 ore"

### 3. Cambio stato → all'ospite
- **Oggetto**: `La tua richiesta per {property.title} è stata {confermata/rifiutata}`

---

## Design & UX

### Estetica
- **Tono**: Mediterranean luxury meets modern minimalism
- **Palette**: sabbia calda (#E8DCC8), azzurro mare (#4A90A4), bianco (#FAFAF8), terracotta (#C2714F), grigio scuro (#2D3436)
- **Tipografia**: **Cormorant Garamond** (display/titoli) + **DM Sans** (body)
- **Foto**: grandi e immersive, con overlay leggero per leggibilità testo
- **Micro-animazioni**: fade-in on scroll, hover scale, transizioni fluide
- **NO**: estetica generica "AI slop", gradient viola, font Inter/Roboto

### Responsive
- Mobile-first
- Gallery: swipe su mobile, grid su desktop
- Calendario: compatto su mobile, doppio mese su desktop
- Form: full-width mobile, sidebar su desktop

---

## Struttura File (App Router)

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # Homepage
│   │   ├── appartamenti/
│   │   │   ├── page.tsx                # Lista proprietà
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Dettaglio proprietà
│   │   ├── chi-siamo/
│   │   │   └── page.tsx
│   │   └── layout.tsx                  # Layout pubblico (navbar + footer)
│   ├── admin/
│   │   ├── page.tsx                    # Dashboard overview
│   │   ├── properties/
│   │   │   ├── page.tsx                # Lista proprietà
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # Edit proprietà
│   │   │       ├── photos/page.tsx
│   │   │       ├── pricing/page.tsx
│   │   │       └── calendar/page.tsx
│   │   ├── requests/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── owners/
│   │   │   └── page.tsx
│   │   └── layout.tsx                  # Layout admin (sidebar + auth guard)
│   ├── api/
│   │   ├── cron/
│   │   │   └── sync-airbnb/route.ts
│   │   ├── booking-request/route.ts
│   │   └── pricing/
│   │       └── calculate/route.ts
│   └── layout.tsx                      # Root layout
├── components/
│   ├── ui/                             # shadcn/ui
│   ├── property-card.tsx
│   ├── photo-gallery.tsx
│   ├── availability-calendar.tsx
│   ├── booking-form.tsx
│   ├── price-calculator.tsx
│   ├── admin/
│   │   ├── sidebar.tsx
│   │   ├── property-form.tsx
│   │   ├── photo-uploader.tsx
│   │   ├── pricing-table.tsx
│   │   ├── calendar-manager.tsx
│   │   └── request-list.tsx
│   └── shared/
│       ├── navbar.tsx
│       ├── footer.tsx
│       └── locale-switcher.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── admin.ts
│   ├── resend.ts
│   ├── ical-parser.ts
│   ├── pricing.ts
│   ├── whatsapp.ts
│   └── utils.ts
├── emails/
│   ├── booking-request-owner.tsx
│   ├── booking-confirmation-guest.tsx
│   └── booking-status-change.tsx
└── types/
    └── index.ts
```

---

## Variabili d'Ambiente

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=
EMAIL_FROM=prenotazioni@[DOMINIO]

# Cron
CRON_SECRET=

# App
NEXT_PUBLIC_SITE_URL=https://[DOMINIO]
```

---

## Ordine di Implementazione

### Fase 1 — Fondamenta & Setup Automatizzato
1. Inizializza progetto Next.js 15 con Tailwind v4 e shadcn/ui
2. Crea progetto Supabase (usa Supabase MCP se disponibile, altrimenti guida l'utente)
3. Esegui migration SQL per creare tutte le tabelle + RLS policies
4. Crea bucket Storage `property-photos` (pubblico)
5. Crea utente admin in Supabase Auth
6. Scarica le 15 foto dagli URL Airbnb e caricale su Supabase Storage
7. Esegui seed data: inserisci owners, properties, property_photos con dati reali
8. Configura TypeScript types
9. **Fermati e mostra il progresso**

### Fase 2 — Admin Dashboard
10. Layout admin con sidebar e protezione auth
11. CRUD Proprietari
12. CRUD Proprietà
13. Upload e gestione foto
14. Gestione pricing rules
15. Vista calendario admin
16. **Fermati e mostra il progresso**

### Fase 3 — Sync Airbnb
17. Parser iCal
18. API Route sync
19. Configurazione Vercel Cron
20. Bottone "Forza sync" nell'admin
21. **Fermati e mostra il progresso**

### Fase 4 — Frontend Pubblico
22. Layout pubblico (navbar, footer, animazioni)
23. Homepage con hero + griglia proprietà
24. Pagina dettaglio con gallery
25. Calendario disponibilità interattivo
26. Calcolo prezzo in tempo reale
27. Form di richiesta prenotazione + integrazione WhatsApp
28. Pagina "Chi Siamo"
29. **Fermati e mostra il progresso**

### Fase 5 — Notifiche
30. Setup Resend + React Email templates
31. Email al proprietario su nuova richiesta
32. Conferma email all'ospite
33. Email cambio stato dall'admin
34. **Fermati e mostra il progresso**

### Fase 6 — Gestione Richieste Admin
35. Lista richieste con filtri
36. Dettaglio + azioni (conferma/rifiuta)
37. Dashboard overview con stats
38. **Fermati e mostra il progresso**

### Fase 7 — Polish & Deploy
39. Internazionalizzazione IT/EN
40. SEO (metadata, Open Graph, sitemap.xml)
41. Performance (image optimization, lazy loading, ISR)
42. Deploy su Vercel
43. Test end-to-end completo
44. **Consegna finale**

---

## Note Importanti

- **Nessun sistema di pagamento**: il pagamento avviene offline tra proprietario e ospite.
- **Sync calendario unidirezionale**: Airbnb → sito. Le prenotazioni confermate qui vanno bloccate manualmente su Airbnb dal proprietario.
- **Foto**: scaricate da Airbnb e caricate su Supabase Storage (non hotlinkare gli URL Airbnb in produzione).
- **Sicurezza**: rate limiting sul form pubblico, validazione server-side, CRON_SECRET per il job.
- **Accessibilità**: WCAG 2.1 AA come target.
- **Scalabilità**: il sistema deve supportare l'aggiunta di nuove proprietà e nuovi proprietari senza modifiche al codice.

---

## Inizia dalla Fase 1

Procedi fase per fase. Al termine di ogni fase, fermati e mostrami il progresso prima di passare alla successiva. Commenta il codice in inglese, contenuti UI in italiano (con predisposizione i18n per inglese).
