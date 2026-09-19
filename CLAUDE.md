# EKsutra - Project Context

## Project Overview
EKsutra is a Federated Verification & Government Service Interoperability Framework (a Smart India Hackathon 2026 prototype). It acts as a middleware interoperability layer for the Indian government ecosystem, allowing different government departments to securely reuse document verification assertions. Instead of citizens submitting and verifying the same documents (Aadhaar, PAN, etc.) at multiple departments, EKsutra stores a cryptographically signed verification assertion upon first verification, which can then be reused with citizen consent.

## Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Lucide React (Icons), Recharts (Charts)
- **Validation:** Zod
- **Security:** Node.js `crypto` (HMAC-SHA256 for digital signatures)
- **Database:** In-memory store (for demo/prototype), with optional Supabase / PostgreSQL configuration.
- **Deployment:** Vercel

## Core Functionality & Workflows
1. **Verification & Consent:** Department A verifies a document and the citizen provides consent. EKsutra stores this as a signed assertion.
2. **Reuse:** Department B requires documents. EKsutra checks for existing verifications. Department B only asks for missing/unverified documents.
3. **Security:** Asserts are signed server-side using HMAC-SHA256. EKsutra only stores verification status, department info, and consent (NO actual PII, biometrics, or document files).
4. **Admin Dashboard:** Includes metrics, audit logs, and demonstrations of failure/tamper states.

## Current Project Structure
- `app/`: Next.js App Router. Contains pages for the landing site, `admin/` (dashboard), `department/` (mock departments like agriculture & scholarship), `technical/` (architecture), and `api/` (endpoints for consent, verification, demo states, admin).
- `components/`: React components (`AssertionModal.tsx`, `AuditLog.tsx`, `ConsentCard.tsx`, `DemoNav.tsx`, `DocumentCard.tsx`, `MetricCard.tsx`, `SystemHealth.tsx`, `TamperDemo.tsx`, `VerificationReport.tsx`).
- `lib/`: Core logic (`types.ts` for TS interfaces, `db.ts` for in-memory store/seeds, `signatures.ts` for HMAC-SHA256 operations).
- `supabase/`: `schema.sql` and `seed.sql` for optional persistent storage setup.

## Next Steps / Modifying the Project
When planning modifications, consider:
- The app relies heavily on synthetic data and an in-memory database by default.
- Any changes to the assertion payload must be reflected in the HMAC-SHA256 signature generation/validation in `lib/signatures.ts`.
- The UI is built using Tailwind CSS v4 and Lucide React. Maintain the existing design system found in `app/globals.css`.

@AGENTS.md
