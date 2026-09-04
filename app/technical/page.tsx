import Link from "next/link";
import { ArrowRight, Shield, GitBranch, Lock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical Architecture — EKsutra",
};

export default function TechnicalPage() {
  return (
    <div style={{ minHeight: "calc(100vh - 52px)", background: "var(--color-bg)" }}>
      <div style={{ background: "white", borderBottom: "1px solid var(--color-border)", padding: "1.5rem" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>
            Optional Technical View
          </div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>How EKsutra Works</h1>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1.25rem" }}>
        {/* Architecture Flow */}
        <div className="card" style={{ marginBottom: "1.5rem", padding: "2rem" }}>
          <h2 style={{ margin: "0 0 1.5rem", fontSize: "1.125rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <GitBranch size={18} style={{ color: "var(--color-primary)" }} />
            Architecture Flow
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0", maxWidth: 440 }}>
            {[
              { label: "Government Portal", desc: "Citizen applies for a government service", color: "var(--color-primary)" },
              { label: "Document Verification", desc: "Department verifies documents (Aadhaar, PAN, etc.)", color: "var(--color-primary)" },
              { label: "Citizen Consent", desc: "Citizen grants permission to store verification status", color: "#7c3aed" },
              { label: "EKsutra Registry", desc: "Signed verification assertions stored securely", color: "var(--color-primary)" },
              { label: "Signature Validation", desc: "HMAC-SHA256 signature verified for integrity", color: "#d97706" },
              { label: "Other Government Services", desc: "Department B retrieves already-verified results", color: "var(--color-success)" },
              { label: "Only Missing Documents", desc: "Citizen provides only what is not yet verified", color: "var(--color-success)" },
            ].map((item, i, arr) => (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    padding: "0.875rem 0",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: item.color,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </div>
                    {i < arr.length - 1 && (
                      <div style={{ width: 2, flex: 1, minHeight: 24, background: "var(--color-border)", margin: "4px 0" }} />
                    )}
                  </div>
                  <div style={{ paddingTop: "0.375rem" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>{item.label}</div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginTop: "0.125rem" }}>{item.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Four Words */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ margin: "0 0 1.25rem", fontSize: "1.125rem", fontWeight: 700 }}>Core Principles</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
            {[
              { word: "CONNECT", desc: "Link departments via a shared interoperability layer", color: "var(--color-primary)" },
              { word: "STANDARDIZE", desc: "Uniform verification assertion format across departments", color: "#7c3aed" },
              { word: "VERIFY", desc: "Cryptographically signed assertions ensure integrity", color: "#d97706" },
              { word: "REUSE", desc: "Verified results travel with the citizen, not the citizen", color: "var(--color-success)" },
            ].map((item) => (
              <div
                key={item.word}
                style={{
                  padding: "1.25rem 1rem",
                  borderTop: `3px solid ${item.color}`,
                  background: "var(--color-bg)",
                  borderRadius: "0 0 0.5rem 0.5rem",
                  textAlign: "center",
                }}
              >
                <div style={{ fontWeight: 800, fontSize: "0.8125rem", letterSpacing: "0.1em", color: item.color, marginBottom: "0.5rem" }}>
                  {item.word}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Signature */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ margin: "0 0 0.75rem", fontSize: "1.125rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Lock size={18} style={{ color: "var(--color-primary)" }} />
            Digital Signature Model
          </h2>
          <p style={{ margin: "0 0 1rem", fontSize: "0.9375rem", color: "var(--color-text-muted)", lineHeight: 1.7 }}>
            Every verification assertion is signed server-side using <strong>HMAC-SHA256</strong> via Node.js built-in <code>crypto</code>.
            The signature covers the assertion&apos;s core fields — ID, subject, document type, status, issuer, timestamps, and consent ID.
          </p>
          <pre
            className="json-block"
            style={{ fontSize: "0.8125rem" }}
          >{`// Signature payload (what gets signed):
[id, subjectId, documentType, documentRef,
 status, verifierDeptId, verifiedAt, validUntil,
 consentId, purpose].join("|")

// Signing (server-side only):
HMAC-SHA256(payload, EKSUTRA_SIGNING_SECRET)

// Verification (constant-time comparison):
timingSafeEqual(expected, actual)

// If any field is modified → signature invalid
// Frontend only sees: signatureStatus: "VALID" | "INVALID"`}</pre>
          <div style={{ marginTop: "1rem", padding: "0.875rem 1rem", background: "var(--color-bg)", borderRadius: "0.5rem", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
            <strong>Private key isolation:</strong> The signing secret is stored in an environment variable and never exposed to the frontend or included in API responses.
          </div>
        </div>

        {/* Security Model */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ margin: "0 0 0.75rem", fontSize: "1.125rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Shield size={18} style={{ color: "var(--color-success)" }} />
            Security Model
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {[
              { label: "Citizen consent required", desc: "Verification results cannot be reused without explicit citizen consent" },
              { label: "Document not stored", desc: "EKsutra stores only verification status, not Aadhaar/PAN/documents" },
              { label: "Assertion integrity", desc: "HMAC-SHA256 signature prevents undetected modification" },
              { label: "Validity window", desc: "Assertions expire after 30 days by default" },
              { label: "Audit trail", desc: "Every reuse event is logged with timestamp, subject, and department" },
              { label: "Department attribution", desc: "EKsutra never claims to have verified — always shows 'Verified by [Department]'" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", gap: "0.75rem", padding: "0.625rem 0", borderBottom: "1px solid var(--color-border)" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-success)", flexShrink: 0, marginTop: "0.4375rem" }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{item.label}</div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginTop: "0.125rem" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Not a replacement note */}
        <div className="card" style={{ background: "var(--color-primary-light)", border: "1px solid #bfdbfe" }}>
          <h3 style={{ margin: "0 0 0.5rem", fontSize: "1rem", fontWeight: 700 }}>EKsutra is not a replacement</h3>
          <p style={{ margin: 0, fontSize: "0.875rem", lineHeight: 1.7, color: "var(--color-text)" }}>
            EKsutra is designed as an <strong>interoperability and orchestration layer</strong> that can work alongside existing
            digital public infrastructure — including API Setu, DigiLocker, MeriPehchaan, and UMANG — not as a replacement.
            Departments retain full control over their verification processes and final service decisions.
          </p>
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <Link href="/" className="btn btn-ghost" style={{ marginRight: "1rem" }}>← Back to Home</Link>
          <Link href="/admin" className="btn btn-primary" id="go-to-admin-from-technical">
            Admin Dashboard <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
