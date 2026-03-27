# Viareggio Homes

A modern web platform for direct booking of vacation apartments in Viareggio, Versilia (Tuscany, Italy). Built as an independent alternative to Airbnb, allowing guests to book directly with property owners without intermediary commissions.

## Tech Stack

| Layer              | Technology                          |
| ------------------ | ----------------------------------- |
| Framework          | Next.js 15 (App Router, Turbopack)  |
| Language           | TypeScript                          |
| UI                 | Tailwind CSS v4, shadcn/ui          |
| Animation          | Framer Motion                       |
| Database & Auth    | Supabase (PostgreSQL)               |
| Email              | Resend (React Email templates)      |
| Internationalization | next-intl (Italian + English)     |
| Validation         | Zod                                 |
| Hosting            | Vercel                              |

## Features

### Guest-Facing

- Browse active vacation properties with photo galleries
- Interactive availability calendar with Airbnb-synced blocked dates
- Real-time price calculation based on seasonal pricing rules
- Direct booking request form with email confirmation
- WhatsApp integration for instant owner contact
- Bilingual interface (Italian / English)

### Admin Dashboard

- Full property management (CRUD) with photo uploads to Supabase Storage
- Seasonal pricing rule configuration
- Booking request queue with status tracking
- Owner management with contact details
- Manual and automatic Airbnb calendar sync (daily cron via Vercel)

## Project Structure

```
src/
├── app/
│   ├── (public)/              # Guest-facing pages
│   │   ├── page.tsx           # Homepage (hero + property grid)
│   │   ├── appartamenti/      # Property catalog + detail pages
│   │   └── chi-siamo/         # About page + contact form
│   ├── admin/                 # Admin dashboard (auth-protected)
│   │   ├── login/
│   │   └── (protected)/       # Owners, properties, requests management
│   └── api/                   # API routes
│       ├── booking-request/   # Booking submission
│       ├── pricing/calculate/ # Price calculation
│       ├── contact/           # Contact form
│       ├── cron/sync-airbnb/  # Daily Airbnb iCal sync
│       └── admin/             # Protected admin endpoints
├── components/
│   ├── public/                # Guest components (hero, booking form, gallery, etc.)
│   ├── admin/                 # Admin components (property form, pricing, photos)
│   └── ui/                    # shadcn/ui base components
├── lib/
│   ├── supabase/              # Supabase clients (server, client, admin) + types
│   ├── pricing.ts             # Price calculation logic
│   ├── sync-airbnb.ts         # Airbnb iCal sync
│   └── ical-parser.ts         # iCal format parser
├── emails/                    # React Email templates
├── messages/                  # i18n translations (it.json, en.json)
└── types/                     # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- A Resend account (for transactional emails)

### Environment Setup

Copy `vercel.env.example` to `.env.local` and fill in your credentials:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
EMAIL_FROM=prenotazioni@versiliahomes.it
CRON_SECRET=
NEXT_PUBLIC_SITE_URL=
```

### Development

```bash
npm install
npm run dev
```

The app runs at [http://localhost:3001](http://localhost:3001) with Turbopack for fast refresh.

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Database Schema

The Supabase PostgreSQL database includes the following tables:

- **owners** -- property owner profiles and contact info
- **properties** -- apartment listings with details, amenities, and Airbnb links
- **property_photos** -- images stored in Supabase Storage
- **pricing_rules** -- default and seasonal pricing per property
- **blocked_dates** -- unavailable dates (synced from Airbnb or manually set)
- **booking_requests** -- guest reservation requests with status tracking

## Airbnb Calendar Sync

The platform automatically syncs availability with Airbnb via iCal feeds:

- A Vercel cron job runs daily at 02:00 UTC (`/api/cron/sync-airbnb`)
- Fetches and parses iCal feeds for each property with an `airbnb_ical_url`
- Blocked dates are stored with `source: "airbnb"` for traceability
- Admins can trigger a manual sync from the dashboard

## Deployment

Deploy to Vercel for the best experience with Next.js:

1. Connect your repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. The `vercel.json` file includes the cron job configuration for Airbnb sync
4. Deployments happen automatically on push
