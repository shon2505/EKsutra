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
  ApiConnection,
  ConnectionRequest,
  AdminMetrics
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
  {
    id: "DEPT-NSDL",
    name: "NSDL PAN Verification",
    shortName: "NSDL",
    service: "Tax & Identity Verification",
    route: "/department/nsdl-pan",
    apiStatus: "HEALTHY",
    color: "#ea580c",
  }
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
  }
];

// ─── Seeded APIs & Connections ─────────────────────────────────────────────────
const SEEDED_API_CONNECTIONS: ApiConnection[] = [
  // Agriculture connections
  { apiId: "API-AADHAAR", name: "UIDAI Aadhaar DB", departmentId: "DEPT-AGR", state: "connected", lastSynced: "10 mins ago", connectedAt: "2026-08-01T10:00:00Z" },
  { apiId: "API-LAND", name: "Land Records Database", departmentId: "DEPT-AGR", state: "connected", lastSynced: "Just now", connectedAt: "2026-08-01T10:00:00Z" },
  { apiId: "API-NSDL", name: "NSDL PAN Verification", departmentId: "DEPT-AGR", state: "pending_outgoing", lastSynced: undefined },
  // Scholarship connections
  { apiId: "API-CASTE", name: "Caste Certificate DB", departmentId: "DEPT-EDU", state: "not_connected" },
  { apiId: "API-INCOME", name: "Income Certificate DB", departmentId: "DEPT-EDU", state: "connected", lastSynced: "1 hour ago", connectedAt: "2026-08-05T10:00:00Z" },
  { apiId: "API-EDU-RECORDS", name: "Student Marksheets DB", departmentId: "DEPT-EDU", state: "connected", lastSynced: "2 mins ago", connectedAt: "2026-08-06T10:00:00Z" },
  // Revenue connections
  { apiId: "API-LAND", name: "Land Records Database", departmentId: "DEPT-REV", state: "connected", lastSynced: "5 mins ago", connectedAt: "2026-08-02T10:00:00Z" },
  { apiId: "API-INCOME", name: "Income Certificate DB", departmentId: "DEPT-REV", state: "connected", lastSynced: "1 hour ago", connectedAt: "2026-08-02T10:00:00Z" },
  { apiId: "API-DOMICILE", name: "Domicile Certificate DB", departmentId: "DEPT-REV", state: "not_connected" },
  // NSDL PAN
  { apiId: "API-ITD", name: "Income Tax Dept DB", departmentId: "DEPT-NSDL", state: "connected", lastSynced: "Just now", connectedAt: "2026-01-01T10:00:00Z" },
  { apiId: "API-MCA", name: "MCA Corporate DB", departmentId: "DEPT-NSDL", state: "pending_incoming" }
];

const SEEDED_CONNECTION_REQUESTS: ConnectionRequest[] = [
  { id: "REQ-001", fromDeptId: "DEPT-AGR", fromDeptName: "Agriculture Department", toDeptId: "DEPT-NSDL", toDeptName: "NSDL PAN Verification", targetApiId: "API-NSDL", targetApiName: "NSDL PAN Verification", timestamp: TODAY + "T09:00:00.000Z", status: "pending" },
  { id: "REQ-002", fromDeptId: "DEPT-MCA", fromDeptName: "Ministry of Corporate Affairs", toDeptId: "DEPT-NSDL", toDeptName: "NSDL PAN Verification", targetApiId: "API-MCA", targetApiName: "MCA Corporate DB", timestamp: TODAY + "T08:30:00.000Z", status: "pending" }
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
    timestamp: TODAY + "T09:00:00.000Z",
    eventType: "CONNECTION_REQUEST_SENT",
    description: "Agriculture Department sent connection request to NSDL PAN Verification",
    departmentId: "DEPT-AGR",
  },
  {
    id: "AUDIT-003",
    timestamp: TODAY + "T09:00:00.000Z",
    eventType: "CONNECTION_REQUEST_RECEIVED",
    description: "Received connection request from Agriculture Department",
    departmentId: "DEPT-NSDL",
  }
];

// ─── Mutable In-Memory Store ───────────────────────────────────────────────────
declare global {
  // eslint-disable-next-line no-var
  var __eksutraStore: {
    users: User[];
    departments: Department[];
    assertions: VerificationAssertion[];
    consents: ConsentRecord[];
    applications: Application[];
    apiConnections: ApiConnection[];
    connectionRequests: ConnectionRequest[];
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
    apiConnections: [...SEEDED_API_CONNECTIONS],
    connectionRequests: [...SEEDED_CONNECTION_REQUESTS],
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
  const idx = db.assertions.findIndex(
    (a) => a.subjectId === assertion.subjectId && a.documentType === assertion.documentType
  );
  if (idx >= 0) {
    db.assertions[idx] = assertion;
  } else {
    db.assertions.push(assertion);
  }
}

export function addAuditEntry(entry: Omit<AuditEntry, "id">): AuditEntry {
  const full: AuditEntry = { ...entry, id: `AUDIT-${uuidv4().slice(0, 8)}` };
  db.audit.unshift(full);
  return full;
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

// ─── Admin Metrics per Department ──────────────────────────────────────────────

export function getDepartmentMetrics(deptId: string): AdminMetrics {
  const deptConnections = db.apiConnections.filter(c => c.departmentId === deptId);
  const totalConnections = deptConnections.length;
  
  const activeRequests = db.connectionRequests.filter(r => 
    (r.fromDeptId === deptId || r.toDeptId === deptId) && r.status === "pending"
  ).length;

  const verificationsReused = Math.floor(Math.random() * 500) + 100; // Mock

  const connected = deptConnections.filter(c => c.state === "connected").length;
  const pending = deptConnections.filter(c => c.state.startsWith("pending")).length;
  const notConnected = deptConnections.filter(c => c.state === "not_connected" || c.state === "removed").length;

  return {
    totalConnections,
    activeRequests,
    verificationsReused,
    avgResponseTime: "124ms",
    connectionBreakdown: [
      { status: "Connected", count: connected },
      { status: "Pending", count: pending },
      { status: "Not Connected", count: notConnected }
    ],
    requestsOverTime: [
      { date: "Sep 1", requests: 12, reused: 45 },
      { date: "Sep 2", requests: 19, reused: 62 },
      { date: "Sep 3", requests: 8, reused: 71 },
      { date: "Sep 4", requests: 14, reused: 89 },
    ]
  };
}

export function getApiConnections(deptId: string) {
  return db.apiConnections.filter(c => c.departmentId === deptId);
}

export function getConnectionRequests(deptId: string) {
  const incoming = db.connectionRequests.filter(r => r.toDeptId === deptId);
  const outgoing = db.connectionRequests.filter(r => r.fromDeptId === deptId);
  return { incoming, outgoing };
}

export function getDepartmentAuditLog(deptId: string) {
  return db.audit.filter(a => a.departmentId === deptId);
}

// ─── Connection State Machine ──────────────────────────────────────────────────

export function sendConnectionRequest(fromDeptId: string, apiId: string, apiName: string) {
  const fromDept = getDepartment(fromDeptId);
  if (!fromDept) return;
  
  const toDeptId = "DEPT-TARGET"; // Mock target
  
  // 1. Update/Add in apiConnections
  let conn = db.apiConnections.find(c => c.departmentId === fromDeptId && c.apiId === apiId);
  if (conn) {
    conn.state = "pending_outgoing";
  } else {
    db.apiConnections.push({
      apiId,
      name: apiName,
      departmentId: fromDeptId,
      state: "pending_outgoing"
    });
  }

  // 2. Add connection request
  db.connectionRequests.push({
    id: `REQ-${uuidv4().slice(0,6)}`,
    fromDeptId,
    fromDeptName: fromDept.name,
    toDeptId,
    toDeptName: "External Department",
    targetApiId: apiId,
    targetApiName: apiName,
    timestamp: new Date().toISOString(),
    status: "pending"
  });

  // 3. Add audit
  addAuditEntry({
    timestamp: new Date().toISOString(),
    eventType: "CONNECTION_REQUEST_SENT",
    description: `Sent connection request for ${apiName}`,
    departmentId: fromDeptId
  });
}

export function acceptConnectionRequest(requestId: string, toDeptId: string) {
  const req = db.connectionRequests.find(r => r.id === requestId);
  if (!req || req.status !== "pending") return;
  
  req.status = "accepted";
  
  // Update incoming state (for toDeptId)
  let conn = db.apiConnections.find(c => c.departmentId === toDeptId && c.apiId === req.targetApiId);
  if (conn) {
    conn.state = "connected";
    conn.connectedAt = new Date().toISOString();
    conn.lastSynced = "Just now";
  }

  // Also try to update outgoing state (if both in system)
  let outConn = db.apiConnections.find(c => c.departmentId === req.fromDeptId && c.apiId === req.targetApiId);
  if (outConn) {
    outConn.state = "connected";
    outConn.connectedAt = new Date().toISOString();
    outConn.lastSynced = "Just now";
  }

  addAuditEntry({
    timestamp: new Date().toISOString(),
    eventType: "CONNECTION_ACCEPTED",
    description: `Accepted connection request from ${req.fromDeptName} for ${req.targetApiName}`,
    departmentId: toDeptId
  });
}

export function rejectConnectionRequest(requestId: string, toDeptId: string) {
  const req = db.connectionRequests.find(r => r.id === requestId);
  if (!req || req.status !== "pending") return;
  
  req.status = "rejected";
  
  let conn = db.apiConnections.find(c => c.departmentId === toDeptId && c.apiId === req.targetApiId);
  if (conn) conn.state = "not_connected";

  let outConn = db.apiConnections.find(c => c.departmentId === req.fromDeptId && c.apiId === req.targetApiId);
  if (outConn) outConn.state = "not_connected";

  addAuditEntry({
    timestamp: new Date().toISOString(),
    eventType: "CONNECTION_REJECTED",
    description: `Rejected connection request from ${req.fromDeptName} for ${req.targetApiName}`,
    departmentId: toDeptId
  });
}

export function disconnectApi(deptId: string, apiId: string) {
  const conn = db.apiConnections.find(c => c.departmentId === deptId && c.apiId === apiId);
  if (conn && conn.state === "connected") {
    conn.state = "not_connected";
    conn.connectedAt = undefined;
    conn.lastSynced = undefined;
    addAuditEntry({
      timestamp: new Date().toISOString(),
      eventType: "API_DISCONNECTED",
      description: `Disconnected from ${conn.name}`,
      departmentId: deptId
    });
  }
}

export function removeApi(deptId: string, apiId: string) {
  const conn = db.apiConnections.find(c => c.departmentId === deptId && c.apiId === apiId);
  if (conn && conn.state === "connected") {
    conn.state = "removed";
    conn.connectedAt = undefined;
    conn.lastSynced = undefined;
    addAuditEntry({
      timestamp: new Date().toISOString(),
      eventType: "API_REMOVED",
      description: `Removed API connection to ${conn.name}`,
      departmentId: deptId
    });
  }
}

export function resetDemoState(): void {
  db.assertions.length = 0;
  SEEDED_ASSERTIONS.forEach((a) => db.assertions.push({ ...a }));
  db.consents.length = 0;
  SEEDED_CONSENTS.forEach((c) => db.consents.push({ ...c }));
  db.applications.length = 0;
  SEEDED_APPLICATIONS.forEach((a) => db.applications.push({ ...a }));
  db.audit.length = 0;
  SEEDED_AUDIT.forEach((a) => db.audit.push({ ...a }));
  db.apiConnections.length = 0;
  SEEDED_API_CONNECTIONS.forEach((a) => db.apiConnections.push({ ...a }));
  db.connectionRequests.length = 0;
  SEEDED_CONNECTION_REQUESTS.forEach((a) => db.connectionRequests.push({ ...a }));
  db.demoState.failureEnabled = false;
  db.demoState.tamperedAssertionId = undefined;
}
