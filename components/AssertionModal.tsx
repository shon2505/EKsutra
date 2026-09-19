"use client";

import { X, Lock, AlertTriangle, CheckCircle } from "lucide-react";
import type { VerificationAssertion } from "@/lib/types";
import Badge from "./ui/Badge";
import Alert from "./ui/Alert";

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
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Lock size={20} style={{ color: "var(--accent-gold)" }} />
            <div>
              <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)" }}>Security Log (For Judges)</h3>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                Technical view — underlying verification record data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: "0.25rem" }}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "1.5rem" }}>
          <Alert variant="warning" style={{ marginBottom: "1.5rem" }}>
            <strong>Demo Verification Records</strong> — underlying documents are not stored by EKsutra.
            Only the verification status and cryptographic signature are stored.
          </Alert>

          {assertions.map((a, idx) => (
            <div key={a.id} style={{ marginBottom: idx < assertions.length - 1 ? "1.5rem" : 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.75rem",
                }}
              >
                {a.signatureStatus === "VALID" ? (
                  <CheckCircle size={18} style={{ color: "var(--status-connected)" }} />
                ) : (
                  <AlertTriangle size={18} style={{ color: "var(--status-error)" }} />
                )}
                <span style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--text-primary)" }}>
                  {a.documentType} Record
                </span>
                <Badge variant={a.signatureStatus === "VALID" ? "success" : "error"}>
                  Signature: {a.signatureStatus}
                </Badge>
                {a._tampered && (
                  <Badge variant="error">
                    ⚠ TAMPERED
                  </Badge>
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

          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "var(--bg-base)", border: "1px solid var(--border-subtle)", borderRadius: "0.5rem", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            <strong>Security model:</strong> Each record is signed server-side using HMAC-SHA256. 
            The signature covers: ID, subject, document type, status, issuer, timestamps, and consent ID. 
            Any modification invalidates the signature. Private keys never leave the server.
          </div>
        </div>
      </div>
    </div>
  );
}
