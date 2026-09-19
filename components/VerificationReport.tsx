"use client";

import { CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import type { CheckVerificationResult, DocumentType } from "@/lib/types";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

const DOC_LABELS: Record<DocumentType, string> = {
  AADHAAR: "Aadhaar Card",
  PAN: "PAN Card",
  DRIVING_LICENCE: "Driving Licence",
  MARKSHEET: "Marksheet",
  INCOME_CERTIFICATE: "Income Certificate",
  LAND_RECORD: "Land Record",
  PROPERTY_TAX_RECEIPT: "Property Tax Receipt",
};

interface VerificationReportProps {
  results: CheckVerificationResult[];
  subjectName: string;
  onVerifyMissing: (docType: DocumentType) => void;
  isVerifyingMissing?: boolean;
}

export default function VerificationReport({
  results,
  subjectName,
  onVerifyMissing,
  isVerifyingMissing,
}: VerificationReportProps) {
  const verified = results.filter((r) => r.status === "ALREADY_VERIFIED");
  const missing = results.filter((r) => r.status !== "ALREADY_VERIFIED");
  const total = results.length;

  return (
    <div className="animate-fade-in-up">
      {/* Big summary headline */}
      <Card
        style={{
          textAlign: "center",
          padding: "2rem",
          marginBottom: "1.5rem",
          border: verified.length === total
            ? "2px solid var(--status-connected)"
            : "2px solid var(--accent-gold)",
        }}
        id="verification-report-summary"
      >
        <div
          style={{
            fontSize: "3rem",
            fontWeight: 700,
            color: verified.length === total ? "var(--status-connected)" : "var(--accent-gold)",
            lineHeight: 1,
            marginBottom: "0.5rem",
          }}
        >
          {verified.length} of {total}
        </div>
        <div style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
          documents fetched successfully
        </div>
        {missing.length > 0 ? (
          <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", margin: 0 }}>
            Instead of uploading everything again, {subjectName} only needs to provide the missing document.
          </p>
        ) : (
          <p style={{ fontSize: "0.9375rem", color: "var(--status-connected)", margin: 0, fontWeight: 500 }}>
            All documents verified — application ready for review.
          </p>
        )}
      </Card>

      {/* Per-document breakdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {results.map((result, i) => {
          const isVerified = result.status === "ALREADY_VERIFIED";
          const delay = `${i * 0.08}s`;

          return (
            <div
              key={result.documentType}
              className="animate-slide-in"
              style={{ 
                animationDelay: delay,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem",
                border: "1px solid",
                borderColor: isVerified ? "var(--status-connected)" : "var(--status-error)",
                borderRadius: "0.5rem",
                background: isVerified ? "rgba(52, 199, 120, 0.05)" : "rgba(224, 90, 90, 0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {isVerified ? (
                  <CheckCircle size={24} style={{ color: "var(--status-connected)", flexShrink: 0 }} />
                ) : (
                  <AlertCircle size={24} style={{ color: "var(--status-error)", flexShrink: 0 }} />
                )}
                <div>
                  <div style={{ fontWeight: 600, fontSize: "1rem" }}>{DOC_LABELS[result.documentType]}</div>
                  {isVerified && result.assertion && (
                    <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: 4 }}>
                      Verified by: <strong>{result.assertion.verifiedBy}</strong>
                      &nbsp;·&nbsp; Valid until {result.assertion.validUntil}
                      &nbsp;·&nbsp;{" "}
                      <span style={{ color: "var(--status-connected)" }}>
                        Signature: {result.assertion.signatureStatus}
                      </span>
                    </div>
                  )}
                  {!isVerified && (
                    <div style={{ fontSize: "0.875rem", color: "var(--status-error)", marginTop: 4 }}>
                      Verification not found in EKsutra registry
                    </div>
                  )}
                </div>
              </div>

              {isVerified ? (
                <Badge variant="success">✓ Fetched</Badge>
              ) : (
                <Badge variant="error">! Required</Badge>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA for missing docs */}
      {missing.length > 0 && missing.map((r) => (
        <Card
          key={r.documentType}
          className="animate-fade-in"
          style={{
            background: "var(--bg-surface-raised)",
            border: "1px solid var(--border-subtle)",
            marginBottom: "1rem",
          }}
        >
          <p style={{ margin: "0 0 1.25rem", fontSize: "1rem", lineHeight: 1.6 }}>
            <strong>{DOC_LABELS[r.documentType]}</strong> needs to be verified.
            This is the only document you need to provide.
          </p>
          <Button
            id={`verify-missing-${r.documentType.toLowerCase()}`}
            onClick={() => onVerifyMissing(r.documentType)}
            disabled={isVerifyingMissing}
          >
            {isVerifyingMissing ? (
              <>
                <div className="spinner" style={{ borderTopColor: "var(--bg-base)" }} />
                Verifying {DOC_LABELS[r.documentType]}...
              </>
            ) : (
              <>
                Verify {DOC_LABELS[r.documentType]}
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        </Card>
      ))}
    </div>
  );
}
