"use client";

const STORE_KEY = "eksutra_verified_docs";

export function addVerifiedDoc(docType: string) {
  if (typeof window === "undefined") return;
  const current = getVerifiedDocs();
  if (!current.includes(docType)) {
    current.push(docType);
    sessionStorage.setItem(STORE_KEY, JSON.stringify(current));
  }
}

export function getVerifiedDocs(): string[] {
  if (typeof window === "undefined") return [];
  const stored = sessionStorage.getItem(STORE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function clearVerifiedDocs() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORE_KEY);
}
