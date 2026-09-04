"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  User,
  CheckCircle,
  ArrowRight,
  Eye,
  Upload,
  Zap,
} from "lucide-react";
import VerificationReport from "@/components/VerificationReport";
import AssertionModal from "@/components/AssertionModal";
import DocumentCard from "@/components/DocumentCard";
import type { CheckVerificationResult, VerificationAssertion, DocumentType } from "@/lib/types";

type FlowStep = "choice" | "checking" | "report" | "verifying-missing" | "complete";

type DocStatus = "idle" | "verifying" | "verified" | "failed";

const CHECK_STEPS = [
  "Matching identity...",
  "Checking consent...",
  "Checking trusted issuer...",
  "Checking verification validity...",
  "Checking verification signature...",
];

export default function ScholarshipPage() {
  const router = useRouter();
  const [step, setStep] = useState<FlowStep>("choice");
  const [checkProgress, setCheckProgress] = useState<number>(0);
  const [verificationResults, setVerificationResults] = useState<CheckVerificationResult[]>([]);
  const [assertionsForModal, setAssertionsForModal] = useState<VerificationAssertion[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [marksheetStatus, setMarksheetStatus] = useState<DocStatus>("idle");
  const [applicationRef] = useState("SCH-2026-1001");

  const requiredDocuments: DocumentType[] = ["AADHAAR", "PAN", "MARKSHEET"];

  // When checking starts, animate through the steps
  useEffect(() => {
    if (step !== "checking") return;
    let i = 0;
    const interval = setInterval(async () => {
      i++;
      setCheckProgress(i);
      if (i >= CHECK_STEPS.length) {
        clearInterval(interval);
        // Now actually call the API
        await runCheck();
      }
    }, 600);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const runCheck = async () => {
    try {
      const res = await fetch("/api/verification/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: "USER-1001",
          requiredDocuments,
          requestingDeptId: "DEPT-EDU",
          requestingDeptName: "Education & Welfare Department",
        }),
      });
      const data = await res.json();
      setVerificationResults(data.results || []);

      // Gather assertions for modal
      const assertions = (data.results || [])
        .filter((r: CheckVerificationResult) => r.assertion)
        .map((r: CheckVerificationResult) => r.assertion as VerificationAssertion);
      setAssertionsForModal(assertions);

      setTimeout(() => setStep("report"), 400);
    } catch {
      setStep("report");
    }
  };

  const handleVerifyMissing = async (docType: DocumentType) => {
    setStep("verifying-missing");
    setMarksheetStatus("verifying");

    // Simulate upload + verification
    await new Promise((r) => setTimeout(r, 3000));

    try {
      // Create assertion for the marksheet
      const res = await fetch("/api/verification/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: "USER-1001",
          subjectName: "Rahul Sharma",
          documentType: docType,
          documentRef: "MARKS-DEMO-001",
          verifierDeptId: "DEPT-EDU",
          verifiedBy: "Education & Welfare Department",
          consentId: "CONSENT-001",
          purpose: "Government Service - Scholarship Application",
        }),
      });
      const data = await res.json();

      if (data.success) {
        setMarksheetStatus("verified");

        // Create application record
        await fetch("/api/application", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subjectId: "USER-1001",
            subjectName: "Rahul Sharma",
            departmentId: "DEPT-EDU",
            departmentName: "Education & Welfare Department",
            serviceName: "Scholarship Application",
            documentsRequired: requiredDocuments,
            documentsVerified: requiredDocuments,
            applicationRef,
          }),
        });

        await new Promise((r) => setTimeout(r, 600));
        setStep("complete");
      } else {
        setMarksheetStatus("failed");
      }
    } catch {
      setMarksheetStatus("failed");
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 52px)", background: "var(--color-bg)" }}>
      {/* Dept Header */}
      <div style={{ background: "white", borderBottom: "3px solid #1d4ed8", padding: "1.5rem" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.25rem" }}>
            <Building2 size={18} style={{ color: "#1d4ed8" }} />
            <span style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Department B</span>
            <span className="badge badge-demo">Prototype / Demonstration Portal</span>
          </div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1d4ed8" }}>
            Education &amp; Welfare Department
          </h1>
          <div style={{ fontSize: "1rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
            Service: Scholarship Application
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1.25rem" }}>
        {/* Applicant Card */}
        <div className="card" style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
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

        {/* ── STEP: CHOICE ── */}
        {step === "choice" && (
          <div className="card animate-fade-in">
            <h2 style={{ margin: "0 0 0.375rem", fontSize: "1.0625rem", fontWeight: 700 }}>
              Documents Required for Scholarship
            </h2>
            <p style={{ margin: "0 0 1.25rem", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
              This service requires the following documents for eligibility verification.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "2rem" }}>
              {["Aadhaar Card", "PAN Card", "Marksheet"].map((doc) => (
                <div
                  key={doc}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    padding: "0.625rem 0.875rem",
                    border: "1px solid var(--color-border)",
                    borderRadius: "0.5rem",
                    background: "var(--color-bg)",
                    fontSize: "0.9375rem",
                  }}
                >
                  <span style={{ color: "var(--color-text-muted)" }}>·</span>
                  {doc}
                </div>
              ))}
            </div>

            <hr className="section-divider" style={{ margin: "0 0 1.5rem" }} />

            <p style={{ margin: "0 0 1.25rem", fontWeight: 600, fontSize: "0.9375rem" }}>
              How would you like to submit your documents?
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {/* Use Eksutra */}
              <button
                id="use-eksutra-btn"
                onClick={() => setStep("checking")}
                style={{
                  border: "2px solid var(--color-primary)",
                  borderRadius: "0.75rem",
                  padding: "1.5rem 1rem",
                  cursor: "pointer",
                  background: "var(--color-primary-light)",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#dbeafe";
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--color-primary-light)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <Zap size={22} style={{ color: "var(--color-primary)" }} />
                <div style={{ fontWeight: 700, color: "var(--color-primary)", fontSize: "1rem" }}>
                  Use EKsutra
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                  Check for existing verified results. May save you from re-submitting documents.
                </div>
              </button>

              {/* Upload manually */}
              <button
                id="upload-manually-btn"
                onClick={() => alert("In a real deployment, this would show a manual upload form. For this demo, please use 'Use EKsutra' to see the key interaction.")}
                style={{
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.75rem",
                  padding: "1.5rem 1rem",
                  cursor: "pointer",
                  background: "white",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#9ca3af";
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <Upload size={22} style={{ color: "var(--color-text-muted)" }} />
                <div style={{ fontWeight: 700, color: "var(--color-text)", fontSize: "1rem" }}>
                  Upload Manually
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                  Upload all documents yourself — Aadhaar, PAN, and Marksheet.
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: CHECKING ── */}
        {step === "checking" && (
          <div className="card animate-fade-in" style={{ padding: "2.5rem 2rem", textAlign: "center" }} id="eksutra-checking-screen">
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "var(--color-primary-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <Zap size={28} style={{ color: "var(--color-primary)" }} />
            </div>
            <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem", fontWeight: 700 }}>
              Checking your verified information...
            </h2>
            <p style={{ margin: "0 0 2rem", color: "var(--color-text-muted)", fontSize: "0.9375rem" }}>
              EKsutra is checking the registry for your existing verified documents.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: 320, margin: "0 auto", textAlign: "left" }}>
              {CHECK_STEPS.map((s, i) => (
                <div
                  key={s}
                  className={checkProgress > i ? "animate-slide-in" : ""}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    opacity: checkProgress > i ? 1 : 0.25,
                    transition: "opacity 0.3s",
                  }}
                >
                  {checkProgress > i ? (
                    <CheckCircle size={18} style={{ color: "var(--color-success)", flexShrink: 0 }} />
                  ) : (
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        border: "2px solid var(--color-border)",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <span style={{ fontSize: "0.9375rem", fontWeight: checkProgress > i ? 500 : 400 }}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP: REPORT ── */}
        {step === "report" && verificationResults.length > 0 && (
          <div>
            <div style={{ marginBottom: "1.25rem" }}>
              <h2 style={{ margin: "0 0 0.25rem", fontSize: "1.25rem", fontWeight: 700 }}>
                EKsutra Verification Report
              </h2>
              <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                Based on existing verifications in the EKsutra registry for Rahul Sharma
              </p>
            </div>
            <VerificationReport
              results={verificationResults}
              subjectName="Rahul Sharma"
              onVerifyMissing={handleVerifyMissing}
            />

            {assertionsForModal.length > 0 && (
              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <button
                  className="btn btn-ghost"
                  style={{ fontSize: "0.8125rem" }}
                  onClick={() => setShowModal(true)}
                  id="view-details-btn"
                >
                  <Eye size={14} />
                  View Technical Details
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP: VERIFYING MISSING ── */}
        {step === "verifying-missing" && (
          <div className="animate-fade-in">
            {/* Verified docs (already done) */}
            <div className="card" style={{ marginBottom: "1.25rem" }}>
              <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: 700 }}>
                Verified via EKsutra
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {verificationResults
                  .filter((r) => r.status === "ALREADY_VERIFIED")
                  .map((r) => (
                    <div
                      key={r.documentType}
                      className="doc-row doc-row-verified"
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                        <CheckCircle size={16} style={{ color: "var(--color-success)" }} />
                        <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
                          {r.documentType === "AADHAAR" ? "Aadhaar Card" : "PAN Card"}
                        </span>
                      </div>
                      <span className="badge badge-success">✓ Reused</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Marksheet verification */}
            <div className="card">
              <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: 700 }}>
                Marksheet Verification
              </h3>
              <DocumentCard
                documentType="MARKSHEET"
                status={marksheetStatus}
                onVerify={() => {}}
                verifiedBy="Education & Welfare Department"
                validUntil="04 Oct 2026"
                disabled
              />
              {marksheetStatus === "verifying" && (
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                    <div>Uploading...</div>
                    <div>Checking...</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP: COMPLETE ── */}
        {step === "complete" && (
          <div className="animate-fade-in-up">
            <div
              className="card"
              style={{
                textAlign: "center",
                padding: "2.5rem 2rem",
                border: "1.5px solid var(--color-success)",
                background: "#f0fdf4",
                marginBottom: "1.5rem",
              }}
              id="application-complete-screen"
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

              <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.625rem", fontWeight: 700 }}>
                Application Ready
              </h2>
              <div style={{ fontSize: "1.0625rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
                Rahul Sharma
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: 340, margin: "0 auto 1.5rem" }}>
                {["Aadhaar Card", "PAN Card", "Marksheet"].map((doc) => (
                  <div
                    key={doc}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.5rem 0.875rem",
                      background: "white",
                      borderRadius: "0.5rem",
                      border: "1px solid #a7f3d0",
                    }}
                  >
                    <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{doc}</span>
                    <span style={{ color: "var(--color-success)", fontWeight: 700 }}>✓</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  maxWidth: 340,
                  margin: "0 auto 1.5rem",
                }}
              >
                {[
                  { label: "Verification", value: "3 / 3 Complete" },
                  { label: "Status", value: "Ready for Review" },
                  { label: "Application ID", value: applicationRef },
                  { label: "Reused via EKsutra", value: "2 documents" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: "white",
                      border: "1px solid #a7f3d0",
                      borderRadius: "0.5rem",
                      padding: "0.75rem",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 700, marginTop: "0.25rem" }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
                EKsutra provides interoperability and verification reuse. Final eligibility and
                approval remain with the department.
              </p>

              <button
                className="btn btn-primary btn-lg"
                onClick={() => router.push("/admin")}
                id="view-admin-dashboard-btn"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
              >
                View Official Dashboard
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && assertionsForModal.length > 0 && (
        <AssertionModal
          assertions={assertionsForModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
