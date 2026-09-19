"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  User,
  CheckCircle,
  ArrowRight,
  Eye,
  Upload,
  Zap,
  Printer,
  Download
} from "lucide-react";
import VerificationReport from "@/components/VerificationReport";
import AssertionModal from "@/components/AssertionModal";
import DocumentCard from "@/components/DocumentCard";
import Image from "next/image";
import IconLogo from "@/components/logo/hero_logo.png";
import type { CheckVerificationResult, VerificationAssertion, DocumentType } from "@/lib/types";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

type FlowStep = "choice" | "checking" | "report" | "verifying-missing" | "complete";

type DocStatus = "idle" | "verifying" | "verified" | "failed";

const CHECK_STEPS = [
  "Matching identity...",
  "Checking access preferences...",
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
    <div style={{ minHeight: "calc(100vh - 56px)", background: "var(--bg-base)" }}>
      {/* Dept Header */}
      <div
        style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <GraduationCap size={20} style={{ color: "var(--accent-gold)" }} />
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Department B
            </span>
            <Badge variant="demo">Prototype Portal</Badge>
          </div>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Education & Welfare Department
          </h1>
          <div style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Service: Scholarship Application
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2.5rem 1.25rem" }}>
        {/* Applicant Card */}
        <Card style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(212, 167, 44, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <User size={24} style={{ color: "var(--accent-gold)" }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.125rem" }}>Rahul Sharma</div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: 2 }}>
              Applicant ID: USER-1001 &nbsp;·&nbsp;
              <Badge variant="demo" style={{ marginLeft: 4 }}>Demo Data</Badge>
            </div>
          </div>
        </Card>

        {/* ── STEP: CHOICE ── */}
        {step === "choice" && (
          <Card className="animate-fade-in">
            <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.125rem", fontWeight: 700 }}>
              Documents Required for Scholarship
            </h2>
            <p style={{ margin: "0 0 1.5rem", fontSize: "0.9375rem", color: "var(--text-secondary)" }}>
              This service requires the following documents for eligibility verification.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "2rem" }}>
              {["Aadhaar Card", "PAN Card", "Marksheet"].map((doc) => (
                <div
                  key={doc}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "0.5rem",
                    background: "var(--bg-base)",
                    fontSize: "0.9375rem",
                  }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>·</span>
                  {doc}
                </div>
              ))}
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", margin: "0 0 1.5rem" }} />

            <p style={{ margin: "0 0 1.25rem", fontWeight: 600, fontSize: "1rem" }}>
              How would you like to submit your documents?
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {/* Use Eksutra */}
              <button
                id="use-eksutra-btn"
                onClick={() => setStep("checking")}
                style={{
                  border: "2px solid var(--accent-gold)",
                  borderRadius: "0.75rem",
                  padding: "1.5rem 1rem",
                  cursor: "pointer",
                  background: "rgba(212, 167, 44, 0.1)",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  transition: "all 0.15s",
                }}
              >
                <Zap size={24} style={{ color: "var(--accent-gold)" }} />
                <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem" }}>
                  Fetch Verified Documents
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Check for existing verified results. Saves you from re-submitting documents.
                </div>
              </button>

              {/* Upload manually */}
              <button
                id="upload-manually-btn"
                onClick={() => alert("In a real deployment, this would show a manual upload form. For this demo, please use 'Fetch Verified Documents' to see the key interaction.")}
                style={{
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "0.75rem",
                  padding: "1.5rem 1rem",
                  cursor: "pointer",
                  background: "var(--bg-base)",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  transition: "all 0.15s",
                }}
              >
                <Upload size={24} style={{ color: "var(--text-secondary)" }} />
                <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem" }}>
                  Upload Manually
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Upload all documents yourself — Aadhaar, PAN, and Marksheet.
                </div>
              </button>
            </div>
          </Card>
        )}

        {/* ── STEP: CHECKING ── */}
        {step === "checking" && (
          <Card className="animate-fade-in" style={{ padding: "3rem 2rem", textAlign: "center" }} id="eksutra-checking-screen">
            <div
              style={{
                width: 64,
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <Image 
                src={IconLogo} 
                alt="Loading" 
                className="animate-pulse-fade" 
                style={{ width: "100%", height: "auto" }} 
              />
            </div>
            <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.5rem", fontWeight: 700 }}>
              Checking your verified information...
            </h2>
            <p style={{ margin: "0 0 2.5rem", color: "var(--text-secondary)", fontSize: "1rem" }}>
              Checking the registry for your existing verified documents.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", maxWidth: 320, margin: "0 auto", textAlign: "left" }}>
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
                    <CheckCircle size={20} style={{ color: "var(--status-connected)", flexShrink: 0 }} />
                  ) : (
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: "2px solid var(--border-subtle)",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <span style={{ fontSize: "0.9375rem", color: "var(--text-primary)", fontWeight: checkProgress > i ? 500 : 400 }}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── STEP: REPORT ── */}
        {step === "report" && verificationResults.length > 0 && (
          <div className="animate-fade-in">
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.5rem", fontWeight: 700 }}>
                Verification Report
              </h2>
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
                Based on existing verifications in the registry for Rahul Sharma
              </p>
            </div>
            <VerificationReport
              results={verificationResults}
              subjectName="Rahul Sharma"
              onVerifyMissing={handleVerifyMissing}
            />

            {assertionsForModal.length > 0 && (
              <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <Button
                  variant="ghost"
                  onClick={() => setShowModal(true)}
                  id="view-details-btn"
                >
                  <Eye size={16} />
                  Security Log (For Judges)
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP: VERIFYING MISSING ── */}
        {step === "verifying-missing" && (
          <div className="animate-fade-in">
            {/* Verified docs (already done) */}
            <Card style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ margin: "0 0 1rem", fontSize: "1.125rem", fontWeight: 700 }}>
                Reused Documents
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {verificationResults
                  .filter((r) => r.status === "ALREADY_VERIFIED")
                  .map((r) => (
                    <div
                      key={r.documentType}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", border: "1px solid var(--status-connected)", borderRadius: "0.5rem", background: "rgba(52, 199, 120, 0.05)" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <CheckCircle size={20} style={{ color: "var(--status-connected)" }} />
                        <span style={{ fontWeight: 600, fontSize: "1rem" }}>
                          {r.documentType === "AADHAAR" ? "Aadhaar Card" : "PAN Card"}
                        </span>
                      </div>
                      <Badge variant="success">✓ Fetched</Badge>
                    </div>
                  ))}
              </div>
            </Card>

            {/* Marksheet verification */}
            <Card>
              <h3 style={{ margin: "0 0 1rem", fontSize: "1.125rem", fontWeight: 700 }}>
                Missing Document Submission
              </h3>
              <DocumentCard
                documentType="MARKSHEET"
                status={marksheetStatus as any}
                onVerify={() => {}}
                verifiedBy="Education & Welfare Department"
                validUntil="04 Oct 2026"
                disabled
              />
              {marksheetStatus === "verifying" && (
                <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9375rem", color: "var(--text-secondary)" }}>
                    <div className="spinner" style={{ margin: "0 auto", borderTopColor: "var(--accent-gold)" }} />
                    <div>Checking...</div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ── STEP: COMPLETE ── */}
        {step === "complete" && (
          <div className="animate-fade-in-up">
            <Card
              style={{
                textAlign: "center",
                padding: "3rem 2rem",
                border: "1px solid var(--status-connected)",
                background: "rgba(52, 199, 120, 0.05)",
                marginBottom: "1.5rem",
              }}
              id="application-complete-screen"
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "rgba(52, 199, 120, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}
              >
                <CheckCircle size={40} style={{ color: "var(--status-connected)" }} />
              </div>

              <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.75rem", fontWeight: 700 }}>
                Application Complete
              </h2>
              <div style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", marginBottom: "2rem" }}>
                Rahul Sharma
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: 360, margin: "0 auto 2rem" }}>
                {["Aadhaar Card", "PAN Card", "Marksheet"].map((doc) => (
                  <div
                    key={doc}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem 1rem",
                      background: "var(--bg-surface)",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(52, 199, 120, 0.3)",
                    }}
                  >
                    <span style={{ fontSize: "0.9375rem", fontWeight: 500 }}>{doc}</span>
                    <span style={{ color: "var(--status-connected)", fontWeight: 700 }}>✓ Submitted</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.25rem",
                  maxWidth: 400,
                  margin: "0 auto 2rem",
                }}
              >
                {[
                  { label: "Verification", value: "3 / 3 Complete" },
                  { label: "Status", value: "Ready for Review" },
                  { label: "Application ID", value: applicationRef },
                  { label: "Reused via EkSutra", value: "2 documents" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "0.5rem",
                      padding: "1rem",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 700, marginTop: "0.375rem" }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}>
                 <Button variant="secondary" onClick={() => alert("Downloading receipt... This is a demo feature.")}>
                   <Download size={18} />
                   Download Receipt
                 </Button>
                 <Button variant="secondary" onClick={() => alert("Printing... This is a demo feature.")}>
                   <Printer size={18} />
                   Print Confirmation
                 </Button>
              </div>

              <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem", opacity: 0.2 }}>
                <Image src={IconLogo} alt="Watermark" style={{ width: 48, height: "auto" }} />
              </div>

              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "2rem" }}>
                <Button
                  size="lg"
                  onClick={() => router.push("/admin")}
                  id="view-admin-dashboard-btn"
                >
                  View Official Dashboard
                  <ArrowRight size={18} />
                </Button>
              </div>
            </Card>
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
