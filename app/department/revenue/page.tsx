"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, User, CheckCircle, ArrowRight, Eye, Download, Printer } from "lucide-react";
import DocumentCard from "@/components/DocumentCard";
import ConsentCard from "@/components/ConsentCard";
import type { DocumentType } from "@/lib/types";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Image from "next/image";
import IconLogo from "@/components/logo/hero_logo.png";
import { addVerifiedDoc, getVerifiedDocs } from "@/lib/sessionStore";
import DepartmentTransition from "@/components/DepartmentTransition";

type DocStatus = "idle" | "checking_eksutra" | "verifying" | "verified" | "failed";

const REQUIRED_DOCS = ["AADHAAR", "LAND_RECORD", "PROPERTY_TAX_RECEIPT"];

type FlowStep = "verify" | "consent" | "success";

export default function RevenueDepartmentPage() {
  const router = useRouter();
  const [docStatuses, setDocStatuses] = useState<Record<string, DocStatus>>(
    REQUIRED_DOCS.reduce((acc, doc) => ({ ...acc, [doc]: "idle" }), {})
  );
  const [docMessages, setDocMessages] = useState<Record<string, string>>({});
  
  const [step, setStep] = useState<FlowStep>("verify");
  const [consentLoading, setConsentLoading] = useState(false);
  const [isRedirecting, setRedirecting] = useState(false);

  const [personalDetails, setPersonalDetails] = useState({
    name: "Rahul Sharma",
    address: "123, Green Park, Pune, Maharashtra",
    dob: "1985-06-15"
  });

  const allVerified = REQUIRED_DOCS.every((d) => docStatuses[d] === "verified");

  const handleManualUpload = async (docType: string, docRef: string) => {
    setDocStatuses((prev) => ({ ...prev, [docType]: "verifying" }));
    setDocMessages((prev) => ({ ...prev, [docType]: "" }));

    // Simulate verification
    await new Promise((r) => setTimeout(r, 2000));

    setDocStatuses((prev) => ({ ...prev, [docType]: "verified" }));
    addVerifiedDoc(docType);
  };

  const handleCheckEksutra = async (docType: string) => {
    setDocStatuses((prev) => ({ ...prev, [docType]: "checking_eksutra" }));
    setDocMessages((prev) => ({ ...prev, [docType]: "" }));

    await new Promise((r) => setTimeout(r, 1500));

    const verifiedDocs = getVerifiedDocs();
    if (verifiedDocs.includes(docType)) {
      setDocStatuses((prev) => ({ ...prev, [docType]: "verified" }));
      setDocMessages((prev) => ({ ...prev, [docType]: "Found in EkSutra — already verified, no re-upload needed." }));
    } else {
      setDocStatuses((prev) => ({ ...prev, [docType]: "failed" }));
      setDocMessages((prev) => ({ ...prev, [docType]: "Not found in EkSutra. Please use manual upload for this document." }));
    }
  };

  const handleConsent = async () => {
    setConsentLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setStep("success");
    setConsentLoading(false);
  };

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: "var(--bg-base)" }}>
      {isRedirecting && (
        <DepartmentTransition targetDept="" targetUrl="" />
      )}
      
      {/* Dept Header */}
      <div style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-subtle)", padding: "1.5rem" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <Building2 size={20} style={{ color: "var(--text-secondary)" }} />
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              DEPT-REV
            </span>
            <Badge variant="demo">Prototype Portal</Badge>
          </div>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Revenue Department
          </h1>
          <div style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Service: Land / Income Verification
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2.5rem 1.25rem" }}>
        {step === "verify" && (
          <>
            {/* Applicant card */}
            <Card style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(212, 167, 44, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <User size={24} style={{ color: "var(--accent-gold)" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1.125rem" }}>Applicant Details</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: 2 }}>
                    Please review and edit if necessary
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Full Name</label>
                  <input value={personalDetails.name} onChange={e => setPersonalDetails({...personalDetails, name: e.target.value})} style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border-subtle)", background: "var(--bg-base)", color: "var(--text-primary)" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Date of Birth</label>
                  <input type="date" value={personalDetails.dob} onChange={e => setPersonalDetails({...personalDetails, dob: e.target.value})} style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border-subtle)", background: "var(--bg-base)", color: "var(--text-primary)" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Address</label>
                  <input value={personalDetails.address} onChange={e => setPersonalDetails({...personalDetails, address: e.target.value})} style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border-subtle)", background: "var(--bg-base)", color: "var(--text-primary)" }} />
                </div>
              </div>
            </Card>

            {/* Documents section */}
            <Card style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.125rem", fontWeight: 700 }}>
                Required Documents
              </h2>
              <p style={{ margin: "0 0 1.5rem", fontSize: "0.9375rem", color: "var(--text-secondary)" }}>
                The following documents are required. Please upload them manually or check EkSutra for verified copies.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {REQUIRED_DOCS.map((doc) => (
                  <DocumentCard
                    key={doc}
                    documentType={doc as DocumentType}
                    status={docStatuses[doc] as any}
                    onVerify={handleManualUpload}
                    onCheckEksutra={handleCheckEksutra}
                    verifiedBy="System"
                    validUntil="12 months"
                    disabled={docStatuses[doc] === "verifying" || docStatuses[doc] === "checking_eksutra" || docStatuses[doc] === "verified"}
                    message={docMessages[doc]}
                  />
                ))}
              </div>
            </Card>

            {/* Continue to consent */}
            {allVerified && (
              <Card className="animate-fade-in-up" style={{ border: "1px solid var(--status-connected)", background: "rgba(52, 199, 120, 0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                  <CheckCircle size={24} style={{ color: "var(--status-connected)" }} />
                  <span style={{ fontWeight: 700, color: "var(--status-connected)", fontSize: "1.125rem" }}>
                    All documents verified successfully
                  </span>
                </div>
                <Button
                  onClick={() => setStep("consent")}
                  id="proceed-to-consent-btn"
                >
                  Proceed
                  <ArrowRight size={18} />
                </Button>
              </Card>
            )}
          </>
        )}

        {step === "consent" && (
          <ConsentCard
            subjectName={personalDetails.name}
            departmentName=""
            onAccept={handleConsent}
            isLoading={consentLoading}
          />
        )}

        {step === "success" && (
          <div className="animate-fade-in-up">
            <Card
              style={{ textAlign: "center", padding: "3rem 2rem", marginBottom: "1.5rem", border: "1px solid var(--status-connected)", background: "rgba(52, 199, 120, 0.05)" }}
            >
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(52, 199, 120, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                <CheckCircle size={40} style={{ color: "var(--status-connected)" }} />
              </div>
              <h2 style={{ margin: "0 0 0.75rem", fontSize: "1.75rem", fontWeight: 700, color: "var(--status-connected)" }}>
                Application Submitted!
              </h2>
              <p style={{ margin: "0 0 2rem", color: "var(--text-primary)", fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Your application is complete and your verified documents are ready for reuse.
              </p>

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

              
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
