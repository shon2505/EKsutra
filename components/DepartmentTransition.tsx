"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import IconLogo from "@/components/logo/hero_logo.png";

export default function DepartmentTransition({ targetDept, targetUrl }: { targetDept: string, targetUrl: string }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(targetUrl);
    }, 1500);
    return () => clearTimeout(timer);
  }, [router, targetUrl]);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "var(--bg-base)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      textAlign: "center",
      padding: "2rem"
    }}>
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
      <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>
        Redirecting you to the {targetDept} portal...
      </h2>
      <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "1rem" }}>
        Please wait securely.
      </p>
    </div>
  );
}
