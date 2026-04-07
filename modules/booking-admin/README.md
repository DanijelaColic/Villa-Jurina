# booking-admin module

Reusable booking system + admin panel for Next.js (App Router) accommodation websites.

**Features:** apartment selection, availability calendar, pricing with seasons, guest form, HUB3/SEPA QR codes, email notifications (Resend), admin dashboard with Gantt timeline, CSV export, overlap warnings.

---

## Folder structure

```
modules/booking-admin/
├── README.md                    ← this file
├── booking.config.ts            ← EDIT THIS — apartments, business rules, brand
├── schema.sql                   ← run once in Supabase SQL editor
├── types/index.ts               ← TypeScript types (Booking, Apartment, ...)
│
├── lib/
│   ├── supabase.ts              ← Supabase server client
│   ├── dates.ts                 ← date utils + seasonal pricing
│   ├── admin-auth.ts            ← admin cookie auth helpers
│   ├── barcode.ts               ← HUB3 PDF417 + EPC SEPA QR generation
│   └── email.ts                 ← Resend email templates
│
├── components/
│   ├── BookingWidget.tsx        ← full booking flow (public)
│   ├── BookingCalendar.tsx      ← availability calendar (used by BookingWidget)
│   └── admin/
│       ├── AdminDashboard.tsx   ← complete admin UI
│       ├── BookingTimeline.tsx  ← Gantt-style timeline view
│       └── Toast.tsx            ← toast notifications
│
└── templates/                   ← COPY TO YOUR app/ directory
    ├── api/
    │   ├── bookings/route.ts
    │   ├── admin/bookings/route.ts
    │   ├── admin/bookings/[id]/route.ts
    │   ├── admin/login/route.ts
    │   └── generate-barcode/route.ts
    ├── app/
    │   ├── admin/page.tsx
    │   ├── admin/layout.tsx
    │   ├── admin/login/page.tsx
    │   └── booking/page.tsx
    └── middleware.ts
```

---

## Step-by-step integration

### 1. Copy the module

```bash
# In your new project root:
cp -r /path/to/modules/booking-admin src/modules/booking-admin
```

### 2. Add tsconfig path alias

In `tsconfig.json`, add:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

The module uses relative imports internally. The templates reference `MODULE_ROOT` — see step 4.

### 3. Install dependencies

```bash
npm install @supabase/supabase-js resend bwip-js qrcode clsx lucide-react
npm install -D @types/qrcode
```

### 4. Set up Supabase

1. Create a Supabase project at https://supabase.com
2. Go to **SQL Editor** and run `schema.sql`
3. Copy your project URL and service role key

### 5. Configure `.env.local`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci...

# Resend (email)
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM=bookings@yourdomain.com   # optional, defaults to onboarding@resend.dev
OWNER_EMAIL=owner@yourdomain.com

# Admin auth
ADMIN_PASSWORD=your-strong-password
ADMIN_TOKEN=a-random-long-secret-string

# Payment / QR codes (only needed if using Croatian HUB3 / SEPA barcodes)
RECIPIENT_IBAN=HR...
RECIPIENT_NAME=Your Name or Company

# Optional branding (can also be hardcoded in booking.config.ts)
NEXT_PUBLIC_SITE_NAME=My Villa
NEXT_PUBLIC_SITE_LOCATION=Dubrovnik, Croatia
NEXT_PUBLIC_LOGO_PATH=/images/logo.png
OWNER_PHONE=+385 91 234 5678
OWNER_WHATSAPP_URL=https://wa.me/385912345678
```

### 6. Edit `booking.config.ts`

Open `src/modules/booking-admin/booking.config.ts` and:

- **Replace `apartments[]`** with your actual apartments (slugs, names, capacities, prices)
- Adjust `DEPOSIT_PERCENT`, `MIN_NIGHTS`, `HIGH_SEASON_MONTHS`, `HIGH_SEASON_LABEL`, `OFF_SEASON_LABEL`
- Set `ADMIN_COOKIE_NAME` (any unique string, e.g. `'myproject_admin'`)
- Set `CSV_EXPORT_PREFIX`

### 7. Copy templates and replace imports

Copy all files from `templates/` to your `src/app/` directory:

```
templates/api/bookings/route.ts          → src/app/api/bookings/route.ts
templates/api/admin/bookings/route.ts    → src/app/api/admin/bookings/route.ts
templates/api/admin/bookings/[id]/route.ts → src/app/api/admin/bookings/[id]/route.ts
templates/api/admin/login/route.ts       → src/app/api/admin/login/route.ts
templates/api/generate-barcode/route.ts  → src/app/api/generate-barcode/route.ts
templates/app/admin/page.tsx             → src/app/admin/page.tsx
templates/app/admin/layout.tsx           → src/app/admin/layout.tsx
templates/app/admin/login/page.tsx       → src/app/admin/login/page.tsx
templates/app/booking/page.tsx           → src/app/(public)/booking/page.tsx (or your path)
templates/middleware.ts                  → src/middleware.ts
```

In every copied file, **replace all occurrences of `MODULE_ROOT`** with your actual module path:

```bash
# If module is at src/modules/booking-admin:
find src/app -name "*.ts" -o -name "*.tsx" | xargs sed -i "s|MODULE_ROOT|@/modules/booking-admin|g"
sed -i "s|MODULE_ROOT|@/modules/booking-admin|g" src/middleware.ts
```

### 8. Configure `next.config.ts`

Add `bwip-js` and `qrcode` to server external packages:

```ts
const nextConfig = {
  serverExternalPackages: ['bwip-js', 'qrcode'],
};
export default nextConfig;
```

### 9. Add `animate-shake` CSS (for login form shake effect)

In your `globals.css`:

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-8px); }
  40%       { transform: translateX(8px); }
  60%       { transform: translateX(-6px); }
  80%       { transform: translateX(6px); }
}
.animate-shake { animation: shake 0.4s ease-in-out; }
```

### 10. Use `BookingWidget` on your public page

```tsx
import BookingWidget from '@/modules/booking-admin/components/BookingWidget';

// On your booking page:
<BookingWidget initialSlug="apartment-1" />
```

Link to booking with pre-selected apartment:

```tsx
<a href="/booking?apartment=apartment-1">Book Apartment 1</a>
```

---

## Environment variables — full list

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | ✅ | Supabase service role key (server only) |
| `ADMIN_PASSWORD` | ✅ | Admin login password |
| `ADMIN_TOKEN` | ✅ | Secret token stored in httpOnly cookie |
| `RESEND_API_KEY` | ✅ | Resend API key (emails won't send without this) |
| `OWNER_EMAIL` | ✅ | Owner notification email |
| `RESEND_FROM` | ⬜ | Sender email (defaults to Resend onboarding address) |
| `RECIPIENT_IBAN` | ⬜ | IBAN for HUB3/SEPA QR codes (barcodes disabled if empty) |
| `RECIPIENT_NAME` | ⬜ | Payee name for HUB3/SEPA QR codes |
| `NEXT_PUBLIC_SITE_NAME` | ⬜ | Shown in emails and admin header |
| `NEXT_PUBLIC_SITE_LOCATION` | ⬜ | Shown in email header subtitle |
| `NEXT_PUBLIC_LOGO_PATH` | ⬜ | Logo path for admin login page |
| `OWNER_PHONE` | ⬜ | Shown in email footer |
| `OWNER_WHATSAPP_URL` | ⬜ | WhatsApp link in emails |
| `ADMIN_COOKIE_NAME` | ⬜ | Cookie name override (default: `app_admin`) |
| `NEXT_PUBLIC_CSV_PREFIX` | ⬜ | CSV export filename prefix |

---

## Database — `bookings` table

Run `schema.sql` once. Columns:

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | auto-generated |
| `apartment_slug` | text | matches slug in `booking.config.ts` |
| `check_in` / `check_out` | date | YYYY-MM-DD |
| `nights` | integer | calculated server-side |
| `guest_name` / `guest_email` / `guest_phone` | text | |
| `adults` / `children` | integer | |
| `price_per_night` | numeric | weighted average |
| `total_price` / `deposit` | numeric | calculated server-side |
| `status` | text | `pending` / `confirmed` / `cancelled` |
| `deposit_paid` | boolean | toggled from admin |
| `notes` | text nullable | |
| `created_at` | timestamptz | auto |

---

## What to manually connect

After copying the module, you need to **manually** do the following:

1. **`booking.config.ts` → apartments array** — replace example apartments with real ones. The `slug` field must match `apartment_slug` in the database.
2. **Navigation links** — link `/booking` (or your chosen path) from your Navbar/Hero/apartment pages.
3. **Styling / CSS variables** — the components use Tailwind CSS classes like `text-primary`, `bg-secondary`, `bg-sand`, `text-muted`. Either map these to your Tailwind theme or do a find-and-replace with your own color classes.
4. **Logo image** — place your logo at the path set in `LOGO_PATH` (default `/images/logo.png`).
5. **Apartment images** — place images at paths defined in the `images` array in `booking.config.ts`.
6. **Email templates** — open `lib/email.ts` and adjust copy (check-in/check-out times, house rules, etc.).
7. **`animate-shake` CSS** — add the keyframe animation (see step 9 above).
8. **`next.config.ts`** — add `serverExternalPackages` (step 8 above).
9. **If you already have `middleware.ts`** — merge the admin auth logic manually instead of replacing your file.

---

## CSS variables expected by components

The components assume these Tailwind custom colors exist in your theme. In `tailwind.config.ts` (or `globals.css` for v4):

```css
/* Tailwind v4 — in globals.css */
@theme {
  --color-primary: #1e4a5f;
  --color-primary-light: #2a6080;
  --color-secondary: #c4975a;
  --color-secondary-light: #d4a96a;
  --color-sand: #e8ddd0;
  --color-sand-light: #fdf8f3;
  --color-text: #1c2b35;
  --color-muted: #6b7a85;
}
```

Adjust colors to match your brand.

---

## What is NOT included

- Public apartment listing pages (these are project-specific)
- Contact form page (only `sendContactEmail` from `lib/email.ts` is included)
- SEO / sitemap / robots
- Authentication beyond simple password (no OAuth, no MFA)
- Multi-language support
- Payment processing (only deposit QR code generation)
