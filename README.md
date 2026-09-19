# EKsutra

EkSutra is the interoperability layer connecting citizens, government services and departmental systems.

> **"The citizen should not have to become the integration layer between government departments."**
>
> **Verify once. Reuse securely.**

EKsutra is a middleware interoperability layer for the Indian government ecosystem. When a government department verifies a citizen's document, EKsutra stores a cryptographically signed verification assertion. Other authorised departments can then reuse that assertion — so citizens only need to provide documents that aren't already verified.

**This is a Smart India Hackathon 2026 prototype. All data is synthetic.**

---

## The Problem

Today, when a citizen visits Department A and gets their Aadhaar and PAN verified, then visits Department B for another service — they are required to **submit and reverify the same documents again**. Citizens carry physical photocopies. Departments re-verify the same data. There is no trust between departments.

EKsutra solves this.

---

## The Solution

```
Department A verifies:    Aadhaar ✓   PAN ✓   DL ✓
                              ↓ citizen gives consent ↓
                         EKsutra stores signed assertions
                              ↓
Department B requires:    Aadhaar ✓   PAN ✓   Marksheet ?

EKsutra checks:
  Aadhaar  → Already Verified by Agriculture Dept ✓
  PAN      → Already Verified by Agriculture Dept ✓
  Marksheet → Not found — verification required

Department B asks citizen: Only upload your marksheet.
```

---

## User Journey (Demo)

1. **Landing page** — EKsutra overview and 4-step explanation
2. **Agriculture Department** — Verify Aadhaar, PAN, and Driving Licence for `Rahul Sharma`
3. **Consent** — Grant permission for EKsutra to store and reuse verification status
4. **Scholarship Application** — Choose "Use EKsutra" to check existing verifications
5. **EKsutra Report** — See that 2 of 3 documents are already verified
6. **Verify Marksheet** — Only the one missing document is requested
7. **Application Complete** — Full verification achieved with minimal effort
8. **Admin Dashboard** — Metrics, charts, audit log, failure demo, tamper demo

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Icons | Lucide React |
| Charts | Recharts |
| Validation | Zod |
| Signatures | Node.js `crypto` (HMAC-SHA256) |
| Database (optional) | Supabase / PostgreSQL |
| Deployment | Vercel |

---

## Project Structure

```
eksutra/
├── app/
│   ├── layout.tsx                    # Root layout + DemoNav
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # Design system
│   ├── admin/
│   │   └── page.tsx                  # Government official dashboard
│   ├── department/
│   │   ├── agriculture/page.tsx      # Dept A — verification + consent
│   │   └── scholarship/page.tsx      # Dept B — EKsutra reuse demo
│   ├── technical/page.tsx            # Architecture explanation
│   └── api/
│       ├── consent/route.ts
│       ├── verification/
│       │   ├── create/route.ts
│       │   ├── check/route.ts
│       │   ├── [subjectId]/route.ts
│       │   └── verify-signature/route.ts
│       ├── application/route.ts
│       ├── demo/
│       │   ├── failure/route.ts
│       │   ├── tamper/route.ts
│       │   └── restore/route.ts
│       └── admin/
│           ├── metrics/route.ts
│           └── audit/route.ts
├── components/
│   ├── DemoNav.tsx
│   ├── DocumentCard.tsx
│   ├── ConsentCard.tsx
│   ├── VerificationReport.tsx
│   ├── AssertionModal.tsx
│   ├── MetricCard.tsx
│   ├── AuditLog.tsx
│   ├── SystemHealth.tsx
│   └── TamperDemo.tsx
├── lib/
│   ├── types.ts                      # All TypeScript interfaces
│   ├── db.ts                         # In-memory store + seed data
│   └── signatures.ts                 # HMAC-SHA256 sign/verify
└── supabase/
    ├── schema.sql                    # PostgreSQL schema
    └── seed.sql                      # Seed data
```

---

## Database Schema

### `verification_assertions`
| Column | Type | Description |
|---|---|---|
| id | TEXT | Unique assertion ID |
| subject_id | TEXT | Citizen synthetic ID (USER-1001) |
| document_type | TEXT | AADHAAR, PAN, DRIVING_LICENCE, etc. |
| document_ref | TEXT | Synthetic reference (never real document) |
| status | TEXT | VERIFIED, PENDING, FAILED |
| verified_by | TEXT | Department name |
| verified_at | DATE | Verification date |
| valid_until | DATE | Expiry date (30 days) |
| consent_id | TEXT | Linked consent record |
| signature | TEXT | HMAC-SHA256 hex signature |

### `consent_records`
| Column | Type | Description |
|---|---|---|
| id | TEXT | Unique consent ID |
| subject_id | TEXT | Citizen ID |
| issuing_dept_id | TEXT | Department that issued consent request |
| permissions | TEXT[] | Permissions granted |
| is_active | BOOLEAN | Whether consent is currently active |

---

## Security Model

### Digital Signatures
Every verification assertion is signed server-side using **HMAC-SHA256** via Node.js built-in `crypto`. The signature covers:

```
[id, subjectId, documentType, documentRef, status,
 verifierDeptId, verifiedAt, validUntil, consentId, purpose].join("|")
```

- Signing happens server-side only — private key never reaches the frontend
- Verification uses `timingSafeEqual` to prevent timing attacks
- Any field modification after signing will cause signature validation to fail
- Frontend only sees `signatureStatus: "VALID" | "INVALID"`

### What EKsutra Does NOT Store
- Actual Aadhaar/PAN/document files
- Document images or scans
- Personal Aadhaar numbers or PAN numbers
- Any biometric data

### What EKsutra DOES Store
- Verification status (VERIFIED/PENDING/FAILED)
- Which department verified the document
- When it was verified and when it expires
- Citizen consent record
- Audit log of all reuse events

### Consent Model
1. Citizen must explicitly consent before any assertion is stored
2. Consent is department-specific (issued by the verifying department)
3. Consent covers reuse of *verification status*, not the actual document
4. All reuse events are logged in the audit trail

---

## How to Run Locally

### Prerequisites
- Node.js 18+
- npm

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd eksutra

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. (Optional) Set a custom signing secret
# Edit .env.local and set EKSUTRA_SIGNING_SECRET

# 5. Start development server
npm run dev

# 6. Open http://localhost:3000
```

The app works immediately without any database setup — it uses in-memory seeded data.

---

## How to Configure Supabase (Optional)

For persistent storage across server restarts:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the Supabase SQL editor
3. Run `supabase/seed.sql` to populate base data
4. Copy your project URL and anon key from Project Settings → API
5. Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `EKSUTRA_SIGNING_SECRET` | Recommended | HMAC signing key. Defaults to demo value. |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Supabase service role key |

---

## Deploy to Vercel

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

### Manual deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# Project → Settings → Environment Variables
# Add: EKSUTRA_SIGNING_SECRET (required for consistent signatures)
# Add: Supabase vars if using persistent DB
```

**Important**: Set `EKSUTRA_SIGNING_SECRET` in Vercel environment variables. Without it, signatures will use a default demo key — fine for demos, not for production.

---

## Demo Credentials

| Field | Value |
|---|---|
| Demo Citizen | Rahul Sharma |
| Citizen ID | USER-1001 |
| Aadhaar Ref | AADHAAR-DEMO-001 |
| PAN Ref | PAN-DEMO-001 |
| DL Ref | DL-DEMO-001 |
| Marksheet Ref | MARKS-DEMO-001 |
| Consent ID | CONSENT-001 |

All data is synthetic. No real government data is used.

---

## Known Limitations (Prototype)

1. **In-memory store resets on server restart** — Supabase integration recommended for persistence
2. **Single demo citizen** — Production would support any authenticated citizen
3. **HMAC-SHA256 instead of PKI** — Production would use department-specific asymmetric keys (RS256 or ES256)
4. **No real authentication** — Production would integrate with MeriPehchaan
5. **No consent revocation UI** — Prototype shows grant only; revocation requires citizen dashboard
6. **Serverless state limitation** — Vercel Edge Functions would reset in-memory state; use Supabase for production

---

## Production Architecture (What Would Be Added)

| Prototype | Production |
|---|---|
| HMAC-SHA256 (shared secret) | RS256/ES256 (per-department key pairs) |
| In-memory store | Supabase/PostgreSQL |
| Synthetic citizen IDs | MeriPehchaan / Aadhaar authentication |
| Single app | Department APIs with EKsutra as orchestrator |
| Demo data | Real department verification APIs |
| No consent revocation | Full consent management dashboard |
| No rate limiting | Rate limiting + abuse detection |

---

## EKsutra vs Existing DPI

EKsutra is **not** a replacement for:

- **API Setu** — API gateway
- **MeriPehchaan** — citizen identity
- **UMANG** — service delivery

EKsutra is an **interoperability and orchestration layer** designed to work **alongside** these systems — enabling trusted verification results to be shared between departments with citizen consent.

---

## License

MIT — Smart India Hackathon 2026 Prototype

**This is a demonstration prototype. Not a real government service.**
