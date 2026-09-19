"use client";

import { CheckCircle, XCircle, AlertCircle, FileText, Loader } from "lucide-react";
import type { DocumentType } from "@/lib/types";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

type DocStatus = "idle" | "fetching" | "verifying" | "verified" | "failed";

const DOC_LABELS: Record<DocumentType, string> = {
  AADHAAR: "Aadhaar Card",
  PAN: "PAN Card",
  DRIVING_LICENCE: "Driving Licence",
  MARKSHEET: "Marksheet",
  INCOME_CERTIFICATE: "Income Certificate",
  LAND_RECORD: "7/12 Land Extract",
  PROPERTY_TAX_RECEIPT: "Property Tax Receipt",
};

const DOC_REFS: Record<DocumentType, string> = {
  AADHAAR: "AADHAAR-DEMO-001",
  PAN: "PAN-DEMO-001",
  DRIVING_LICENCE: "DL-DEMO-001",
  MARKSHEET: "MARKS-DEMO-001",
  INCOME_CERTIFICATE: "INC-DEMO-001",
  LAND_RECORD: "LAND-DEMO-001",
  PROPERTY_TAX_RECEIPT: "PROP-DEMO-001",
};

interface DocumentCardProps {
  documentType: DocumentType;
  status: "idle" | "checking_eksutra" | "verifying" | "verified" | "failed";
  onVerify: (docType: DocumentType, docRef: string) => void;
  onCheckEksutra?: (docType: DocumentType, docRef: string) => void;
  verifiedBy?: string;
  validUntil?: string;
  disabled?: boolean;
  message?: string;
}

export default function DocumentCard({
  documentType,
  status,
  onVerify,
  onCheckEksutra,
  verifiedBy,
  validUntil,
  disabled,
  message,
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
          : status === "verifying" || status === "checking_eksutra"
          ? "doc-row-pending"
          : ""
      } animate-fade-in`}
      id={`doc-card-${documentType.toLowerCase()}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.25rem 1.5rem",
        border: "1px solid var(--border-subtle)",
        borderRadius: "0.5rem",
        background: status === "verified" ? "rgba(52, 199, 120, 0.05)" : status === "failed" ? "rgba(224, 90, 90, 0.05)" : (status === "verifying" || status === "checking_eksutra") ? "rgba(232, 179, 57, 0.05)" : "var(--bg-surface-raised)",
        borderColor: status === "verified" ? "var(--status-connected)" : status === "failed" ? "var(--status-error)" : (status === "verifying" || status === "checking_eksutra") ? "var(--status-pending)" : "var(--border-subtle)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ 
          width: 40, height: 40, borderRadius: "0.5rem",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: status === "verified" ? "var(--status-connected)" : "var(--bg-surface)",
          color: status === "verified" ? "var(--bg-base)" : "var(--text-secondary)",
        }}>
          <FileText size={20} />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: "1rem" }}>{label}</div>
          <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: 4 }}>
            Ref: {ref}
            {status === "verified" && verifiedBy && (
              <> &nbsp;·&nbsp; System Verified by: <strong style={{ color: "var(--status-connected)" }}>{verifiedBy}</strong></>
            )}
            {status === "verified" && validUntil && (
              <> &nbsp;·&nbsp; Valid until {validUntil}</>
            )}
          </div>
          {message && (
            <div style={{ fontSize: "0.875rem", color: status === "failed" ? "var(--status-error)" : "var(--status-connected)", marginTop: 8 }}>
              {message}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
        {(status === "idle" || status === "failed") && (
          <>
            <Button
              id={`check-eksutra-btn-${documentType.toLowerCase()}`}
              size="sm"
              variant="secondary"
              onClick={() => onCheckEksutra && onCheckEksutra(documentType, ref)}
              disabled={disabled}
            >
              Check on EkSutra
            </Button>
            <Button
              id={`verify-btn-${documentType.toLowerCase()}`}
              size="sm"
              onClick={() => onVerify(documentType, ref)}
              disabled={disabled}
            >
              Upload manually
            </Button>
          </>
        )}

        {status === "checking_eksutra" && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--status-pending)", fontSize: "0.875rem", fontWeight: 500 }}>
            <div className="spinner" />
            <span>Checking EkSutra...</span>
          </div>
        )}

        {status === "verifying" && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--status-pending)", fontSize: "0.875rem", fontWeight: 500 }}>
            <div className="spinner" />
            <span>Verifying document...</span>
          </div>
        )}

        {status === "verified" && (
          <div className="animate-check-pop" style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--status-connected)", fontWeight: 600, fontSize: "1rem" }}>
            <CheckCircle size={20} />
            <span>Verified</span>
          </div>
        )}
      </div>
    </div>
  );
}

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
    <div className="animate-slide-in" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", border: "1px solid var(--status-connected)", borderRadius: "0.5rem", background: "rgba(52, 199, 120, 0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <CheckCircle size={24} style={{ color: "var(--status-connected)", flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: "1rem" }}>{DOC_LABELS[documentType]}</div>
          <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: 4 }}>
            System Verified by: <strong>{verifiedBy}</strong> &nbsp;·&nbsp; Valid until {validUntil}
          </div>
        </div>
      </div>
      <Badge variant="success">✓ Fetched Automatically</Badge>
    </div>
  );
}

export function MissingDocRow({ documentType }: { documentType: DocumentType }) {
  return (
    <div className="animate-slide-in" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", border: "1px solid var(--status-error)", borderRadius: "0.5rem", background: "rgba(224, 90, 90, 0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <AlertCircle size={24} style={{ color: "var(--status-error)", flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: "1rem" }}>{DOC_LABELS[documentType]}</div>
          <div style={{ fontSize: "0.875rem", color: "var(--status-error)", marginTop: 4 }}>
            Verification not found — please submit manually
          </div>
        </div>
      </div>
      <Badge variant="error">! Required</Badge>
    </div>
  );
}
