"use client";

import { X, Lock, AlertTriangle, CheckCircle } from "lucide-react";
import type { VerificationAssertion } from "@/lib/types";

interface AssertionModalProps {
  assertions: VerificationAssertion[];
  onClose: () => void;
}

export default function AssertionModal({ assertions, onClose }: AssertionModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose} id="assertion-modal">
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <Lock size={18} style={{ color: "var(--color-primary)" }} />
            <div>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Verification Details</h3>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                Technical view — for judges and reviewers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", padding: "0.25rem" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "1.25rem 1.5rem" }}>
          <div
            style={{
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
              marginBottom: "1.25rem",
              fontSize: "0.8125rem",
              color: "#92400e",
            }}
          >
            <strong>Demo Verification Assertions</strong> — underlying documents are not stored by EKsutra.
            Only the verification status and cryptographic signature are stored.
          </div>

          {assertions.map((a, idx) => (
            <div key={a.id} style={{ marginBottom: idx < assertions.length - 1 ? "1.5rem" : 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.625rem",
                }}
              >
                {a.signatureStatus === "VALID" ? (
                  <CheckCircle size={15} style={{ color: "var(--color-success)" }} />
                ) : (
                  <AlertTriangle size={15} style={{ color: "var(--color-error)" }} />
                )}
                <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                  {a.documentType} Assertion
                </span>
                <span
                  className={`badge ${a.signatureStatus === "VALID" ? "badge-success" : "badge-error"}`}
                  style={{ fontSize: "0.6875rem" }}
                >
                  Signature: {a.signatureStatus}
                </span>
                {a._tampered && (
                  <span className="badge badge-error" style={{ fontSize: "0.6875rem" }}>
                    ⚠ TAMPERED
                  </span>
                )}
              </div>
              <pre className="json-block">
                {JSON.stringify(
                  {
                    id: a.id,
                    subjectId: a.subjectId,
                    documentType: a.documentType,
                    documentRef: a.documentRef,
                    status: a.status,
                    verifiedBy: a.verifiedBy,
                    issuerDeptId: a.verifierDeptId,
                    verifiedAt: a.verifiedAt,
                    validUntil: a.validUntil,
                    purpose: a.purpose,
                    consentId: a.consentId,
                    signature: a.signature.slice(0, 32) + "...[truncated]",
                    signatureStatus: a.signatureStatus,
                    ...(a._tampered ? { _NOTE: "validUntil modified without updating signature" } : {}),
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          ))}

          <div style={{ marginTop: "1.25rem", padding: "0.875rem 1rem", background: "var(--color-bg)", borderRadius: "0.5rem", fontSize: "0.8125rem", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
            <strong>Security model:</strong> Each assertion is signed server-side using HMAC-SHA256. 
            The signature covers: ID, subject, document type, status, issuer, timestamps, and consent ID. 
            Any modification invalidates the signature. Private keys never leave the server.
          </div>
        </div>
      </div>
    </div>
  );
}
