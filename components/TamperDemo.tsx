"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, RotateCcw, Zap } from "lucide-react";

interface TamperDemoProps {
  assertionId: string;
  documentType: string;
  isTampered: boolean;
  onTamper: () => Promise<void>;
  onRestore: () => Promise<void>;
}

export default function TamperDemo({
  assertionId,
  documentType,
  isTampered,
  onTamper,
  onRestore,
}: TamperDemoProps) {
  const [loading, setLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState<null | { valid: boolean }>(null);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/verification/verify-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assertionId }),
      });
      const data = await res.json();
      setVerifyResult({ valid: data.signatureStatus === "VALID" });
    } finally {
      setLoading(false);
    }
  };

  const handleTamper = async () => {
    setLoading(true);
    setVerifyResult(null);
    await onTamper();
    setLoading(false);
  };

  const handleRestore = async () => {
    setLoading(true);
    setVerifyResult(null);
    await onRestore();
    setLoading(false);
  };

  return (
    <div
      className="card"
      style={{
        border: isTampered ? "1.5px solid var(--color-error)" : "1px solid var(--color-border)",
        borderRadius: "0.75rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.875rem" }}>
        <AlertTriangle size={18} style={{ color: isTampered ? "var(--color-error)" : "#d97706" }} />
        <div>
          <h4 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 700 }}>
            Assertion Tampering Demo
          </h4>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
            Technical demonstration — {documentType} assertion
          </p>
        </div>
        {isTampered && (
          <span className="badge badge-error" style={{ marginLeft: "auto" }}>⚠ TAMPERED</span>
        )}
      </div>

      <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginBottom: "1rem", lineHeight: 1.6 }}>
        Click &quot;Simulate Tampering&quot; to modify the{" "}
        <code style={{ background: "var(--color-bg)", padding: "0.125rem 0.375rem", borderRadius: "0.25rem" }}>
          validUntil
        </code>{" "}
        field without updating the digital signature. Then verify to see the signature fail.
      </p>

      {/* Current state */}
      {isTampered && (
        <div
          style={{
            background: "var(--color-error-light)",
            border: "1px solid #fca5a5",
            borderRadius: "0.5rem",
            padding: "0.875rem 1rem",
            marginBottom: "1rem",
            fontSize: "0.875rem",
          }}
        >
          <div style={{ fontWeight: 600, color: "var(--color-error)", marginBottom: "0.375rem" }}>
            Assertion Modified
          </div>
          <div style={{ color: "var(--color-text)" }}>
            <code>validUntil</code> changed to <code>2099-12-31</code> (without updating signature)
          </div>
        </div>
      )}

      {/* Verify result */}
      {verifyResult !== null && (
        <div
          style={{
            background: verifyResult.valid ? "var(--color-success-light)" : "var(--color-error-light)",
            border: `1px solid ${verifyResult.valid ? "#a7f3d0" : "#fca5a5"}`,
            borderRadius: "0.5rem",
            padding: "0.875rem 1rem",
            marginBottom: "1rem",
            fontSize: "0.875rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600, color: verifyResult.valid ? "var(--color-success)" : "var(--color-error)" }}>
            {verifyResult.valid ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
            {verifyResult.valid
              ? "Signature VALID — assertion is unmodified"
              : "Signature INVALID — assertion has been tampered with"}
          </div>
          {!verifyResult.valid && (
            <div style={{ marginTop: "0.5rem", color: "var(--color-text)" }}>
              <div>Expected: Signature valid</div>
              <div>Actual: Signature invalid — digital signature validation failed.</div>
              <div style={{ marginTop: "0.375rem", fontStyle: "italic" }}>
                The verification assertion may have been modified after signing.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
        {!isTampered ? (
          <button
            id="tamper-btn"
            className="btn btn-danger"
            onClick={handleTamper}
            disabled={loading}
          >
            <Zap size={15} />
            Simulate Assertion Tampering
          </button>
        ) : (
          <>
            <button
              id="verify-tampered-btn"
              className="btn btn-ghost"
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? <div className="spinner" /> : null}
              Run Signature Verification
            </button>
            <button
              id="restore-btn"
              className="btn btn-secondary"
              onClick={handleRestore}
              disabled={loading}
            >
              <RotateCcw size={15} />
              Restore Original Assertion
            </button>
          </>
        )}
      </div>
    </div>
  );
}
