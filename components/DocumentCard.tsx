"use client";

import { useState } from "react";
import { CheckCircle, XCircle, AlertCircle, FileText, Loader } from "lucide-react";
import type { DocumentType } from "@/lib/types";

type DocStatus = "idle" | "verifying" | "verified" | "failed";

const DOC_LABELS: Record<DocumentType, string> = {
  AADHAAR: "Aadhaar Card",
  PAN: "PAN Card",
  DRIVING_LICENCE: "Driving Licence",
  MARKSHEET: "Marksheet",
  INCOME_CERTIFICATE: "Income Certificate",
  LAND_RECORD: "Land Record",
};

const DOC_REFS: Record<DocumentType, string> = {
  AADHAAR: "AADHAAR-DEMO-001",
  PAN: "PAN-DEMO-001",
  DRIVING_LICENCE: "DL-DEMO-001",
  MARKSHEET: "MARKS-DEMO-001",
  INCOME_CERTIFICATE: "INC-DEMO-001",
  LAND_RECORD: "LAND-DEMO-001",
};

interface DocumentCardProps {
  documentType: DocumentType;
  status: DocStatus;
  onVerify: (docType: DocumentType, docRef: string) => void;
  verifiedBy?: string;
  validUntil?: string;
  disabled?: boolean;
}

export default function DocumentCard({
  documentType,
  status,
  onVerify,
  verifiedBy,
  validUntil,
  disabled,
}: DocumentCardProps) {
  const label = DOC_LABELS[documentType];
  const ref = DOC_REFS[documentType];

  return (
    <div
      className={`doc-row ${
        status === "verified"
          ? "doc-row-verified"
          : status === "failed"
          ? "doc-row-error"
          : status === "verifying"
          ? "doc-row-pending"
          : ""
      } animate-fade-in`}
      id={`doc-card-${documentType.toLowerCase()}`}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <FileText
          size={18}
          style={{
            color:
              status === "verified"
                ? "var(--color-success)"
                : status === "failed"
                ? "var(--color-error)"
                : "var(--color-text-muted)",
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{label}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: 2 }}>
            Ref: {ref}
            {status === "verified" && verifiedBy && (
              <> &nbsp;·&nbsp; Verified by: <strong style={{ color: "var(--color-success)" }}>{verifiedBy}</strong></>
            )}
            {status === "verified" && validUntil && (
              <> &nbsp;·&nbsp; Valid until {validUntil}</>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
        {status === "idle" && (
          <button
            id={`verify-btn-${documentType.toLowerCase()}`}
            className="btn btn-primary"
            style={{ padding: "0.4375rem 1rem", fontSize: "0.875rem" }}
            onClick={() => onVerify(documentType, ref)}
            disabled={disabled}
          >
            Verify
          </button>
        )}

        {status === "verifying" && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
            <div className="spinner" />
            <span>Verifying...</span>
          </div>
        )}

        {status === "verified" && (
          <div className="animate-check-pop" style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--color-success)", fontWeight: 600, fontSize: "0.9375rem" }}>
            <CheckCircle size={20} />
            <span>Verified</span>
          </div>
        )}

        {status === "failed" && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--color-error)", fontWeight: 600, fontSize: "0.9375rem" }}>
            <XCircle size={20} />
            <span>Failed</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Separate smaller component for "already verified" read-only display
export function VerifiedDocRow({
  documentType,
  verifiedBy,
  validUntil,
}: {
  documentType: DocumentType;
  verifiedBy: string;
  validUntil: string;
}) {
  return (
    <div className="doc-row doc-row-verified animate-slide-in">
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <CheckCircle size={18} style={{ color: "var(--color-success)", flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{DOC_LABELS[documentType]}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: 2 }}>
            Verified by: <strong>{verifiedBy}</strong> &nbsp;·&nbsp; Valid until {validUntil}
          </div>
        </div>
      </div>
      <span className="badge badge-success">✓ Already Verified</span>
    </div>
  );
}

// Component for "not found" document
export function MissingDocRow({ documentType }: { documentType: DocumentType }) {
  return (
    <div className="doc-row doc-row-error animate-slide-in">
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <AlertCircle size={18} style={{ color: "var(--color-error)", flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{DOC_LABELS[documentType]}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--color-error)", marginTop: 2 }}>
            Verification not found — needs to be verified
          </div>
        </div>
      </div>
      <span className="badge badge-error">! Required</span>
    </div>
  );
}
