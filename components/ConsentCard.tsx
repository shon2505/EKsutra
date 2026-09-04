"use client";

import { Shield, Check } from "lucide-react";

interface ConsentCardProps {
  subjectName: string;
  departmentName: string;
  onAccept: () => void;
  isLoading?: boolean;
}

export default function ConsentCard({
  subjectName,
  departmentName,
  onAccept,
  isLoading,
}: ConsentCardProps) {
  return (
    <div
      className="card animate-fade-in-up"
      style={{
        border: "1.5px solid var(--color-primary)",
        borderRadius: "0.75rem",
        padding: "2rem",
        maxWidth: 560,
        margin: "0 auto",
      }}
      id="consent-card"
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "var(--color-primary-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Shield size={20} style={{ color: "var(--color-primary)" }} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.0625rem", fontWeight: 700 }}>Consent for EKsutra</h3>
          <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
            Please review and accept before continuing
          </p>
        </div>
      </div>

      <hr className="section-divider" />

      {/* Body */}
      <p
        style={{
          fontSize: "0.9375rem",
          lineHeight: 1.7,
          color: "var(--color-text)",
          margin: "0 0 1.25rem",
        }}
      >
        <strong>{departmentName}</strong> has verified your documents. With your permission,
        EKsutra can securely store the <em>verification status</em> and allow authorised
        government services to reuse these verified results — without sharing the underlying document.
      </p>

      {/* Permissions */}
      <div
        style={{
          background: "var(--color-bg)",
          borderRadius: "0.5rem",
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.625rem",
        }}
      >
        {[
          "Store verification status (not the actual document)",
          "Allow authorised government services to reuse verified results",
          "Maintain a secure audit trail of all reuse events",
        ].map((item) => (
          <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "var(--color-success-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              <Check size={12} style={{ color: "var(--color-success)" }} />
            </div>
            <span style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Important note */}
      <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
        <strong>Note:</strong> You are consenting to the reuse of <em>verification assertions</em>,
        not the actual Aadhaar, PAN, or other documents. Your original documents remain with the
        issuing authorities.
      </p>

      <button
        id="consent-accept-btn"
        className="btn btn-primary btn-lg"
        style={{ width: "100%" }}
        onClick={onAccept}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="spinner" style={{ borderTopColor: "white" }} />
            Saving consent...
          </>
        ) : (
          <>
            <Check size={18} />
            Accept &amp; Continue
          </>
        )}
      </button>

      <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.875rem", marginBottom: 0 }}>
        Applicant: <strong>{subjectName}</strong>
      </p>
    </div>
  );
}
