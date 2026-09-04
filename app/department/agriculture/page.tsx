"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, User, CheckCircle, ArrowRight, Eye } from "lucide-react";
import DocumentCard from "@/components/DocumentCard";
import ConsentCard from "@/components/ConsentCard";
import AssertionModal from "@/components/AssertionModal";
import type { DocumentType, VerificationAssertion } from "@/lib/types";

type DocStatus = "idle" | "verifying" | "verified" | "failed";

const REQUIRED_DOCS: DocumentType[] = ["AADHAAR", "PAN", "DRIVING_LICENCE"];
const DOC_REFS: Record<DocumentType, string> = {
  AADHAAR: "AADHAAR-DEMO-001",
  PAN: "PAN-DEMO-001",
  DRIVING_LICENCE: "DL-DEMO-001",
  MARKSHEET: "MARKS-DEMO-001",
  INCOME_CERTIFICATE: "INC-DEMO-001",
  LAND_RECORD: "LAND-DEMO-001",
};

type FlowStep = "verify" | "consent" | "success";

export default function AgriculturePage() {
  const router = useRouter();
  const [docStatuses, setDocStatuses] = useState<Record<DocumentType, DocStatus>>({
    AADHAAR: "idle",
    PAN: "idle",
    DRIVING_LICENCE: "idle",
    MARKSHEET: "idle",
    INCOME_CERTIFICATE: "idle",
    LAND_RECORD: "idle",
  });
  const [createdAssertions, setCreatedAssertions] = useState<VerificationAssertion[]>([]);
  const [consentId, setConsentId] = useState<string | null>(null);
  const [step, setStep] = useState<FlowStep>("verify");
  const [consentLoading, setConsentLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [failureSimActive, setFailureSimActive] = useState(false);
  const [retryMsg, setRetryMsg] = useState<string | null>(null);

  const allVerified = REQUIRED_DOCS.every((d) => docStatuses[d] === "verified");

  const handleVerify = async (docType: DocumentType, docRef: string) => {
    setDocStatuses((prev) => ({ ...prev, [docType]: "verifying" }));

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 600));

    try {
      let res = await fetch("/api/verification/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: "USER-1001",
          subjectName: "Rahul Sharma",
          documentType: docType,
          documentRef: docRef,
          verifierDeptId: "DEPT-AGR",
          verifiedBy: "Agriculture Department",
          consentId: consentId || "CONSENT-PENDING",
          purpose: "Government Service - Farmer Registration",
        }),
      });

      // Handle failure simulation
      if (res.status === 503) {
        setFailureSimActive(true);
        setRetryMsg("Department service temporarily unavailable. Retrying...");
        setDocStatuses((prev) => ({ ...prev, [docType]: "verifying" }));
        await new Promise((r) => setTimeout(r, 2000));

        // Auto-disable failure and retry
        await fetch("/api/demo/failure", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enable: false }),
        });

        setRetryMsg("Retry successful ✓ Verification completed.");
        await new Promise((r) => setTimeout(r, 1000));
        setRetryMsg(null);
        setFailureSimActive(false);

        // Retry the actual request
        res = await fetch("/api/verification/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subjectId: "USER-1001",
            subjectName: "Rahul Sharma",
            documentType: docType,
            documentRef: docRef,
            verifierDeptId: "DEPT-AGR",
            verifiedBy: "Agriculture Department",
            consentId: consentId || "CONSENT-PENDING",
            purpose: "Government Service - Farmer Registration",
          }),
        });
      }

      const data = await res.json();
      if (data.success && data.assertion) {
        setCreatedAssertions((prev) => {
          const filtered = prev.filter((a) => a.documentType !== docType);
          return [...filtered, data.assertion];
        });
        setDocStatuses((prev) => ({ ...prev, [docType]: "verified" }));
      } else {
        setDocStatuses((prev) => ({ ...prev, [docType]: "failed" }));
      }
    } catch {
      setDocStatuses((prev) => ({ ...prev, [docType]: "failed" }));
    }
  };

  const handleConsent = async () => {
    setConsentLoading(true);
    try {
      const res = await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: "USER-1001",
          subjectName: "Rahul Sharma",
          issuingDeptId: "DEPT-AGR",
          issuingDeptName: "Agriculture Department",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConsentId(data.consent.id);
        setStep("success");
      }
    } finally {
      setConsentLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 52px)", background: "var(--color-bg)" }}>
      {/* Dept Header */}
      <div
        style={{
          background: "white",
          borderBottom: "3px solid #15803d",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.25rem" }}>
            <Building2 size={18} style={{ color: "#15803d" }} />
            <span style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
              Department A
            </span>
            <span className="badge badge-demo">Prototype / Demonstration Portal</span>
          </div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#15803d" }}>
            Agriculture Department
          </h1>
          <div style={{ fontSize: "1rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
            Service: Farmer Registration
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1.25rem" }}>
        {/* Failure retry notice */}
        {retryMsg && (
          <div
            className="animate-fade-in"
            style={{
              background: failureSimActive ? "#fffbeb" : "var(--color-success-light)",
              border: `1px solid ${failureSimActive ? "#fde68a" : "#a7f3d0"}`,
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
              marginBottom: "1.25rem",
              fontSize: "0.875rem",
              color: failureSimActive ? "#92400e" : "var(--color-success)",
              fontWeight: 500,
            }}
          >
            {retryMsg}
          </div>
        )}

        {step === "verify" && (
          <>
            {/* Applicant card */}
            <div className="card" style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "var(--color-primary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <User size={20} style={{ color: "var(--color-primary)" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1.0625rem" }}>Rahul Sharma</div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                    Applicant ID: USER-1001 &nbsp;·&nbsp;
                    <span className="badge badge-demo" style={{ marginLeft: 4 }}>Demo Data</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents section */}
            <div className="card" style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ margin: "0 0 0.375rem", fontSize: "1.0625rem", fontWeight: 700 }}>
                Document Verification
              </h2>
              <p style={{ margin: "0 0 1.25rem", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                The following documents are required for Farmer Registration. Click <strong>Verify</strong> to begin verification.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {REQUIRED_DOCS.map((doc) => (
                  <DocumentCard
                    key={doc}
                    documentType={doc}
                    status={docStatuses[doc]}
                    onVerify={handleVerify}
                    verifiedBy="Agriculture Department"
                    validUntil="04 Oct 2026"
                    disabled={docStatuses[doc] === "verifying"}
                  />
                ))}
              </div>

              {/* Progress */}
              {REQUIRED_DOCS.some((d) => docStatuses[d] !== "idle") && (
                <div style={{ marginTop: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", color: "var(--color-text-muted)", marginBottom: "0.375rem" }}>
                    <span>Verification progress</span>
                    <span>
                      {REQUIRED_DOCS.filter((d) => docStatuses[d] === "verified").length} / {REQUIRED_DOCS.length}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${allVerified ? "progress-fill-success" : ""}`}
                      style={{
                        width: `${(REQUIRED_DOCS.filter((d) => docStatuses[d] === "verified").length / REQUIRED_DOCS.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Technical details */}
            {createdAssertions.length > 0 && (
              <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                <button
                  className="btn btn-ghost"
                  style={{ fontSize: "0.8125rem" }}
                  onClick={() => setShowModal(true)}
                  id="view-assertions-btn"
                >
                  <Eye size={14} />
                  View Verification Details (Technical)
                </button>
              </div>
            )}

            {/* Continue to consent */}
            {allVerified && (
              <div className="card animate-fade-in-up" style={{ border: "1.5px solid var(--color-success)", background: "#f0fdf4" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
                  <CheckCircle size={20} style={{ color: "var(--color-success)" }} />
                  <span style={{ fontWeight: 700, color: "var(--color-success)", fontSize: "1.0625rem" }}>
                    All documents verified
                  </span>
                </div>
                <p style={{ margin: "0 0 1rem", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                  All 3 documents have been successfully verified by the Agriculture Department.
                  The next step is to provide consent for EKsutra to store and reuse these verification results.
                </p>
                <button
                  className="btn btn-primary"
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                  onClick={() => setStep("consent")}
                  id="proceed-to-consent-btn"
                >
                  Proceed to Consent
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

        {step === "consent" && (
          <div>
            <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
              <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem", fontWeight: 700 }}>
                One more step
              </h2>
              <p style={{ color: "var(--color-text-muted)", margin: 0 }}>
                Your documents are verified. Allow EKsutra to save and reuse these results.
              </p>
            </div>
            <ConsentCard
              subjectName="Rahul Sharma"
              departmentName="Agriculture Department"
              onAccept={handleConsent}
              isLoading={consentLoading}
            />
          </div>
        )}

        {step === "success" && (
          <div className="animate-fade-in-up">
            {/* Success header */}
            <div
              className="card"
              style={{
                textAlign: "center",
                padding: "2.5rem 2rem",
                marginBottom: "1.5rem",
                border: "1.5px solid var(--color-success)",
                background: "#f0fdf4",
              }}
              id="success-state"
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "var(--color-success-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.25rem",
                }}
              >
                <CheckCircle size={32} style={{ color: "var(--color-success)" }} />
              </div>
              <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.5rem", fontWeight: 700, color: "var(--color-success)" }}>
                You&apos;re all set!
              </h2>
              <p style={{ margin: "0 0 1.5rem", color: "var(--color-text-muted)", fontSize: "0.9375rem" }}>
                Your verified information can now be reused by eligible government services.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", maxWidth: 320, margin: "0 auto 1.5rem" }}>
                {REQUIRED_DOCS.map((doc) => (
                  <div key={doc} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.875rem", background: "white", borderRadius: "0.5rem", border: "1px solid #a7f3d0" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                      {doc === "AADHAAR" ? "Aadhaar" : doc === "PAN" ? "PAN Card" : "Driving Licence"}
                    </span>
                    <span style={{ color: "var(--color-success)", fontWeight: 700, fontSize: "0.9375rem" }}>✓</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--color-text-muted)",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.375rem",
                }}
              >
                <span style={{ color: "var(--color-primary)" }}>🔐</span>
                Stored as secure verification assertions in EKsutra Registry
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  className="btn btn-ghost"
                  style={{ fontSize: "0.8125rem" }}
                  onClick={() => setShowModal(true)}
                >
                  <Eye size={14} />
                  View Verification Details
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => router.push("/department/scholarship")}
                  id="continue-to-scholarship-btn"
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  Continue to another service
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Assertion Modal */}
      {showModal && createdAssertions.length > 0 && (
        <AssertionModal
          assertions={createdAssertions}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
