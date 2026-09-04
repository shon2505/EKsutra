// EKsutra — TypeScript Types

export interface User {
  id: string;
  name: string;
  syntheticId: string; // e.g. USER-1001
  email?: string;
}

export type DocumentType =
  | "AADHAAR"
  | "PAN"
  | "DRIVING_LICENCE"
  | "MARKSHEET"
  | "INCOME_CERTIFICATE"
  | "LAND_RECORD";

export type VerificationStatus = "VERIFIED" | "PENDING" | "FAILED" | "EXPIRED";

export interface VerificationAssertion {
  id: string;
  subjectId: string;
  subjectName: string;
  documentType: DocumentType;
  documentRef: string; // Synthetic reference, not real doc
  status: VerificationStatus;
  verifiedBy: string; // Department name
  verifierDeptId: string;
  verifiedAt: string; // ISO date string
  validUntil: string; // ISO date string
  purpose: string;
  consentId: string;
  signature: string; // HMAC-SHA256 hex
  signatureStatus?: "VALID" | "INVALID" | "TAMPERED";
  // For tampering demo only
  _tampered?: boolean;
  _originalValidUntil?: string;
}

export interface ConsentRecord {
  id: string;
  subjectId: string;
  subjectName: string;
  grantedAt: string;
  issuingDeptId: string;
  issuingDeptName: string;
  permissions: string[];
  isActive: boolean;
}

export interface Department {
  id: string;
  name: string;
  shortName: string;
  service: string;
  route: string;
  apiStatus: "HEALTHY" | "DEGRADED" | "DOWN";
  color: string;
}

export interface Application {
  id: string;
  applicationRef: string; // e.g. SCH-2026-1001
  subjectId: string;
  subjectName: string;
  departmentId: string;
  departmentName: string;
  serviceName: string;
  documentsRequired: DocumentType[];
  documentsVerified: DocumentType[];
  status: "IN_PROGRESS" | "READY_FOR_REVIEW" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  eventType: string;
  description: string;
  subjectId?: string;
  departmentId?: string;
  assertionId?: string;
  applicationId?: string;
}

export interface AdminMetrics {
  totalApplications: number;
  verifiedDocuments: number;
  verificationReuse: number;
  applicationsCompleted: number;
  departmentUsage: { department: string; count: number }[];
  verificationOverTime: { date: string; verified: number; reused: number }[];
  statusBreakdown: { status: string; count: number }[];
}

// API Request / Response types
export interface CheckVerificationRequest {
  subjectId: string;
  requiredDocuments: DocumentType[];
}

export interface CheckVerificationResult {
  documentType: DocumentType;
  status: "ALREADY_VERIFIED" | "NOT_FOUND" | "EXPIRED";
  assertion?: VerificationAssertion;
}

export interface CheckVerificationResponse {
  subjectId: string;
  results: CheckVerificationResult[];
  alreadyVerifiedCount: number;
  totalRequired: number;
  consentActive: boolean;
}

export interface DemoState {
  failureEnabled: boolean;
  tamperedAssertionId?: string;
}
