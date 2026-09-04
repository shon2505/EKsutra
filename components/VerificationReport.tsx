"use client";

import { CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import type { CheckVerificationResult, DocumentType } from "@/lib/types";

const DOC_LABELS: Record<DocumentType, string> = {
  AADHAAR: "Aadhaar Card",
  PAN: "PAN Card",
  DRIVING_LICENCE: "Driving Licence",
  MARKSHEET: "Marksheet",
  INCOME_CERTIFICATE: "Income Certificate",
  LAND_RECORD: "Land Record",
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
      <div
        className="card"
        style={{
          textAlign: "center",
          padding: "2rem",
          marginBottom: "1.5rem",
          borderRadius: "0.75rem",
          border: verified.length === total
            ? "2px solid var(--color-success)"
            : "2px solid var(--color-primary)",
        }}
        id="verification-report-summary"
      >
        <div
          style={{
            fontSize: "3rem",
            fontWeight: 700,
            color: verified.length === total ? "var(--color-success)" : "var(--color-primary)",
            lineHeight: 1,
            marginBottom: "0.5rem",
          }}
        >
          {verified.length} of {total}
        </div>
        <div style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
          documents already verified
        </div>
        {missing.length > 0 ? (
          <p style={{ fontSize: "0.9375rem", color: "var(--color-text-muted)", margin: 0 }}>
            Instead of uploading everything again, {subjectName} only needs to provide the missing document.
          </p>
        ) : (
          <p style={{ fontSize: "0.9375rem", color: "var(--color-success)", margin: 0, fontWeight: 500 }}>
            All documents verified — application ready for review.
          </p>
        )}
      </div>

      {/* Per-document breakdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {results.map((result, i) => {
          const isVerified = result.status === "ALREADY_VERIFIED";
          const delay = `${i * 0.08}s`;

          return (
            <div
              key={result.documentType}
              className={`doc-row ${isVerified ? "doc-row-verified" : "doc-row-error"} animate-slide-in`}
              style={{ animationDelay: delay }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {isVerified ? (
                  <CheckCircle size={20} style={{ color: "var(--color-success)", flexShrink: 0 }} />
                ) : (
                  <AlertCircle size={20} style={{ color: "var(--color-error)", flexShrink: 0 }} />
                )}
                <div>
                  <div style={{ fontWeight: 600 }}>{DOC_LABELS[result.documentType]}</div>
                  {isVerified && result.assertion && (
                    <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: 2 }}>
                      Verified by: <strong>{result.assertion.verifiedBy}</strong>
                      &nbsp;·&nbsp; Valid until {result.assertion.validUntil}
                      &nbsp;·&nbsp;{" "}
                      <span style={{ color: "var(--color-success)" }}>
                        Signature: {result.assertion.signatureStatus}
                      </span>
                    </div>
                  )}
                  {!isVerified && (
                    <div style={{ fontSize: "0.75rem", color: "var(--color-error)", marginTop: 2 }}>
                      Verification not found in EKsutra registry
                    </div>
                  )}
                </div>
              </div>

              {isVerified ? (
                <span className="badge badge-success">✓ Already Verified</span>
              ) : (
                <span className="badge badge-error">! Required</span>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA for missing docs */}
      {missing.length > 0 && missing.map((r) => (
        <div
          key={r.documentType}
          className="card animate-fade-in"
          style={{
            background: "var(--color-primary-light)",
            border: "1px solid #bfdbfe",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            marginBottom: "1rem",
          }}
        >
          <p style={{ margin: "0 0 1rem", fontSize: "0.9375rem", lineHeight: 1.6 }}>
            <strong>{DOC_LABELS[r.documentType]}</strong> needs to be verified.
            This is the only document you need to provide.
          </p>
          <button
            id={`verify-missing-${r.documentType.toLowerCase()}`}
            className="btn btn-primary"
            onClick={() => onVerifyMissing(r.documentType)}
            disabled={isVerifyingMissing}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            {isVerifyingMissing ? (
              <>
                <div className="spinner" style={{ borderTopColor: "white" }} />
                Verifying {DOC_LABELS[r.documentType]}...
              </>
            ) : (
              <>
                Verify {DOC_LABELS[r.documentType]}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
