"use client";

import { Check } from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Image from "next/image";
import PrimaryLogo from "@/components/logo/hero_logo.png";

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
    <Card
      className="animate-fade-in-up"
      style={{
        border: "1.5px solid var(--accent-gold)",
        maxWidth: 560,
        margin: "0 auto",
      }}
      id="consent-card"
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginRight: "0.5rem"
          }}
        >
          <Image 
            src={PrimaryLogo} 
            alt="EkSutra Logo" 
            style={{ height: 32, width: "auto" }} 
          />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)" }}>Allow EkSutra to create a secure digital signature</h3>
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", margin: "1.5rem 0" }} />

      {/* Body */}
      <p
        style={{
          fontSize: "1rem",
          lineHeight: 1.7,
          color: "var(--text-primary)",
          margin: "0 0 1.25rem",
        }}
      >
        EkSutra never stores your documents. It only verifies them and creates an encrypted digital signature — valid for 12 months — so other departments can confirm it's genuine without asking you to upload again. Everything stays fully encrypted and isn't accessible to anyone. Your privacy matters.
      </p>



      <Button
        id="consent-accept-btn"
        size="lg"
        style={{ width: "100%" }}
        onClick={onAccept}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="spinner" style={{ borderTopColor: "var(--bg-base)" }} />
            Saving preferences...
          </>
        ) : (
          <>
            <Check size={20} />
            I Agree & Continue
          </>
        )}
      </Button>

      <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "1rem", marginBottom: 0 }}>
        Applicant: <strong style={{ color: "var(--text-primary)" }}>{subjectName}</strong>
      </p>
    </Card>
  );
}
