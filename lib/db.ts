// EKsutra — In-Memory Data Store with Seeded Demo Data
// This module acts as the application data layer.
// When Supabase env vars are configured, this store is used as a fallback/seed.
// For the demo, this is the primary store — no external DB required.

import { v4 as uuidv4 } from "uuid";
import { signAssertion } from "./signatures";
import type {
  User,
  Department,
  VerificationAssertion,
  ConsentRecord,
  Application,
  AuditEntry,
  DemoState,
} from "./types";

// ─── Seed Dates ────────────────────────────────────────────────────────────────
const TODAY = "2026-09-04";
const VALID_UNTIL = "2026-10-04";

// ─── Departments ───────────────────────────────────────────────────────────────
export const DEPARTMENTS: Department[] = [
  {
    id: "DEPT-AGR",
    name: "Agriculture Department",
    shortName: "Agriculture",
    service: "Farmer Registration",
    route: "/department/agriculture",
    apiStatus: "HEALTHY",
    color: "#15803d",
  },
  {
    id: "DEPT-EDU",
    name: "Education & Welfare Department",
    shortName: "Education",
    service: "Scholarship Application",
    route: "/department/scholarship",
    apiStatus: "HEALTHY",
    color: "#1d4ed8",
  },
  {
    id: "DEPT-REV",
    name: "Revenue Department",
    shortName: "Revenue",
    service: "Land / Income Verification",
    route: "/department/revenue",
    apiStatus: "HEALTHY",
    color: "#7c3aed",
  },
];

// ─── Users ─────────────────────────────────────────────────────────────────────
const USERS: User[] = [
  {
    id: "USER-1001",
    name: "Rahul Sharma",
    syntheticId: "USER-1001",
    email: "rahul.sharma@demo.eksutra.in",
  },
];

// ─── Helper to build a signed assertion ───────────────────────────────────────
function buildAssertion(
  params: Omit<VerificationAssertion, "signature" | "signatureStatus" | "_tampered" | "_originalValidUntil">
): VerificationAssertion {
  const sig = signAssertion(params);
  return { ...params, signature: sig, signatureStatus: "VALID" };
}

// ─── Seeded Verification Assertions ───────────────────────────────────────────
// These are created as if Department A already verified Rahul's docs.
const SEEDED_ASSERTIONS: VerificationAssertion[] = [
  buildAssertion({
    id: "ASSERT-001",
    subjectId: "USER-1001",
    subjectName: "Rahul Sharma",
    documentType: "AADHAAR",
    documentRef: "AADHAAR-DEMO-001",
    status: "VERIFIED",
    verifiedBy: "Agriculture Department",
    verifierDeptId: "DEPT-AGR",
    verifiedAt: TODAY,
    validUntil: VALID_UNTIL,
    purpose: "Government Service - Farmer Registration",
    consentId: "CONSENT-001",
  }),
  buildAssertion({
    id: "ASSERT-002",
    subjectId: "USER-1001",
    subjectName: "Rahul Sharma",
    documentType: "PAN",
    documentRef: "PAN-DEMO-001",
    status: "VERIFIED",
    verifiedBy: "Agriculture Department",
    verifierDeptId: "DEPT-AGR",
    verifiedAt: TODAY,
    validUntil: VALID_UNTIL,
    purpose: "Government Service - Farmer Registration",
    consentId: "CONSENT-001",
  }),
  buildAssertion({
    id: "ASSERT-003",
    subjectId: "USER-1001",
    subjectName: "Rahul Sharma",
    documentType: "DRIVING_LICENCE",
    documentRef: "DL-DEMO-001",
    status: "VERIFIED",
    verifiedBy: "Agriculture Department",
    verifierDeptId: "DEPT-AGR",
    verifiedAt: TODAY,
    validUntil: VALID_UNTIL,
    purpose: "Government Service - Farmer Registration",
    consentId: "CONSENT-001",
  }),
];

// ─── Seeded Consent ────────────────────────────────────────────────────────────
const SEEDED_CONSENTS: ConsentRecord[] = [
  {
    id: "CONSENT-001",
    subjectId: "USER-1001",
    subjectName: "Rahul Sharma",
    grantedAt: TODAY + "T10:30:00.000Z",
    issuingDeptId: "DEPT-AGR",
    issuingDeptName: "Agriculture Department",
    permissions: [
      "STORE_VERIFICATION_STATUS",
      "ALLOW_AUTHORIZED_REUSE",
    ],
    isActive: true,
  },
];

// ─── Seeded Applications ───────────────────────────────────────────────────────
const SEEDED_APPLICATIONS: Application[] = [
  {
    id: "APP-001",
    applicationRef: "AGR-2026-2045",
    subjectId: "USER-1001",
    subjectName: "Rahul Sharma",
    departmentId: "DEPT-AGR",
    departmentName: "Agriculture Department",
    serviceName: "Farmer Registration",
    documentsRequired: ["AADHAAR", "PAN", "DRIVING_LICENCE"],
    documentsVerified: ["AADHAAR", "PAN", "DRIVING_LICENCE"],
    status: "READY_FOR_REVIEW",
    createdAt: TODAY + "T10:28:00.000Z",
    updatedAt: TODAY + "T10:35:00.000Z",
  },
  {
    id: "APP-002",
    applicationRef: "REV-2026-3011",
    subjectId: "USER-1002",
    subjectName: "Priya Mehta",
    departmentId: "DEPT-REV",
    departmentName: "Revenue Department",
    serviceName: "Land / Income Verification",
    documentsRequired: ["AADHAAR", "PAN", "INCOME_CERTIFICATE"],
    documentsVerified: ["AADHAAR", "PAN"],
    status: "IN_PROGRESS",
    createdAt: TODAY + "T10:20:00.000Z",
    updatedAt: TODAY + "T10:25:00.000Z",
  },
];

// ─── Seeded Audit Log ──────────────────────────────────────────────────────────
const SEEDED_AUDIT: AuditEntry[] = [
  {
    id: "AUDIT-001",
    timestamp: TODAY + "T10:30:00.000Z",
    eventType: "CONSENT_GRANTED",
    description: "Rahul Sharma gave consent for verification reuse",
    subjectId: "USER-1001",
    departmentId: "DEPT-AGR",
  },
  {
    id: "AUDIT-002",
    timestamp: TODAY + "T10:31:00.000Z",
    eventType: "ASSERTION_CREATED",
    description: "Aadhaar verification assertion created and signed",
    subjectId: "USER-1001",
    departmentId: "DEPT-AGR",
    assertionId: "ASSERT-001",
  },
  {
    id: "AUDIT-003",
    timestamp: TODAY + "T10:31:30.000Z",
    eventType: "ASSERTION_CREATED",
    description: "PAN verification assertion created and signed",
    subjectId: "USER-1001",
    departmentId: "DEPT-AGR",
    assertionId: "ASSERT-002",
  },
  {
    id: "AUDIT-004",
    timestamp: TODAY + "T10:32:00.000Z",
    eventType: "ASSERTION_CREATED",
    description: "Driving Licence verification assertion created and signed",
    subjectId: "USER-1001",
    departmentId: "DEPT-AGR",
    assertionId: "ASSERT-003",
  },
  {
    id: "AUDIT-005",
    timestamp: TODAY + "T10:36:00.000Z",
    eventType: "VERIFICATION_REQUEST",
    description: "Education & Welfare Dept requested Eksutra verification for Rahul Sharma",
    subjectId: "USER-1001",
    departmentId: "DEPT-EDU",
  },
  {
    id: "AUDIT-006",
    timestamp: TODAY + "T10:36:10.000Z",
    eventType: "ASSERTION_REUSED",
    description: "PAN verification assertion reused by Education & Welfare Dept",
    subjectId: "USER-1001",
    departmentId: "DEPT-EDU",
    assertionId: "ASSERT-002",
  },
  {
    id: "AUDIT-007",
    timestamp: TODAY + "T10:36:20.000Z",
    eventType: "ASSERTION_REUSED",
    description: "Aadhaar verification assertion reused by Education & Welfare Dept",
    subjectId: "USER-1001",
    departmentId: "DEPT-EDU",
    assertionId: "ASSERT-001",
  },
  {
    id: "AUDIT-008",
    timestamp: TODAY + "T10:37:00.000Z",
    eventType: "VERIFICATION_REQUESTED",
    description: "Marksheet verification requested at Education & Welfare Dept",
    subjectId: "USER-1001",
    departmentId: "DEPT-EDU",
  },
];

// ─── Mutable In-Memory Store ───────────────────────────────────────────────────
// Using a simple object so Next.js doesn't reset it between HMR reloads
// (in production Supabase handles persistence).

declare global {
  // eslint-disable-next-line no-var
  var __eksutraStore: {
    users: User[];
    departments: Department[];
    assertions: VerificationAssertion[];
    consents: ConsentRecord[];
    applications: Application[];
    audit: AuditEntry[];
    demoState: DemoState;
  } | undefined;
}

function initStore() {
  return {
    users: [...USERS],
    departments: [...DEPARTMENTS],
    assertions: [...SEEDED_ASSERTIONS],
    consents: [...SEEDED_CONSENTS],
    applications: [...SEEDED_APPLICATIONS],
    audit: [...SEEDED_AUDIT],
    demoState: {
      failureEnabled: false,
      tamperedAssertionId: undefined,
    },
  };
}

export const db = global.__eksutraStore ?? initStore();

if (process.env.NODE_ENV !== "production") {
  global.__eksutraStore = db;
}

// ─── DB Helper Functions ───────────────────────────────────────────────────────

export function getUser(id: string): User | undefined {
  return db.users.find((u) => u.id === id);
}

export function getDepartment(id: string): Department | undefined {
  return db.departments.find((d) => d.id === id);
}

export function getAssertionsForSubject(subjectId: string): VerificationAssertion[] {
  return db.assertions.filter(
    (a) => a.subjectId === subjectId && a.status === "VERIFIED"
  );
}

export function getActiveConsent(subjectId: string): ConsentRecord | undefined {
  return db.consents.find(
    (c) => c.subjectId === subjectId && c.isActive
  );
}

export function addAssertion(assertion: VerificationAssertion): void {
  // Remove any existing assertion for same subject+docType (update it)
  const idx = db.assertions.findIndex(
    (a) => a.subjectId === assertion.subjectId && a.documentType === assertion.documentType
  );
  if (idx >= 0) {
    db.assertions[idx] = assertion;
  } else {
    db.assertions.push(assertion);
  }
}

export function addConsent(consent: ConsentRecord): void {
  db.consents.push(consent);
}

export function addApplication(app: Application): void {
  const idx = db.applications.findIndex((a) => a.id === app.id);
  if (idx >= 0) {
    db.applications[idx] = app;
  } else {
    db.applications.push(app);
  }
}

export function updateApplication(id: string, updates: Partial<Application>): Application | null {
  const idx = db.applications.findIndex((a) => a.id === id);
  if (idx < 0) return null;
  db.applications[idx] = { ...db.applications[idx], ...updates };
  return db.applications[idx];
}

export function addAuditEntry(entry: Omit<AuditEntry, "id">): AuditEntry {
  const full: AuditEntry = { ...entry, id: `AUDIT-${uuidv4().slice(0, 8)}` };
  db.audit.unshift(full); // Most recent first
  return full;
}

export function getAdminMetrics() {
  const totalApplications = db.applications.length + 1244; // Offset for realistic demo numbers
  const verifiedDocuments = db.assertions.length + 3839;
  const verificationReuse = 2916;
  const applicationsCompleted = 986;

  const departmentUsage = [
    { department: "Agriculture", count: 512 },
    { department: "Education", count: 389 },
    { department: "Revenue", count: 347 },
  ];

  const verificationOverTime = [
    { date: "Sep 1", verified: 210, reused: 142 },
    { date: "Sep 2", verified: 285, reused: 198 },
    { date: "Sep 3", verified: 312, reused: 234 },
    { date: "Sep 4", verified: db.assertions.length + 95, reused: 87 },
  ];

  const statusBreakdown = [
    { status: "Verified", count: verifiedDocuments },
    { status: "Pending", count: 127 },
    { status: "Failed", count: 43 },
  ];

  return {
    totalApplications,
    verifiedDocuments,
    verificationReuse,
    applicationsCompleted,
    departmentUsage,
    verificationOverTime,
    statusBreakdown,
  };
}

export function resetDemoState(): void {
  // Reset assertions to seed state
  db.assertions.length = 0;
  SEEDED_ASSERTIONS.forEach((a) => db.assertions.push({ ...a }));
  db.consents.length = 0;
  SEEDED_CONSENTS.forEach((c) => db.consents.push({ ...c }));
  db.applications.length = 0;
  SEEDED_APPLICATIONS.forEach((a) => db.applications.push({ ...a }));
  db.audit.length = 0;
  SEEDED_AUDIT.forEach((a) => db.audit.push({ ...a }));
  db.demoState.failureEnabled = false;
  db.demoState.tamperedAssertionId = undefined;
}
