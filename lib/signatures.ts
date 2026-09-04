// EKsutra — HMAC-SHA256 Signature Utilities (Server-side only)
// Uses Node.js built-in crypto — no external dependency required.
// Private key stays in environment variable; never exposed to frontend.

import { createHmac, timingSafeEqual } from "crypto";
import type { VerificationAssertion } from "./types";

const SECRET_KEY =
  process.env.EKSUTRA_SIGNING_SECRET || "eksutra-demo-secret-key-2026";

/**
 * Build a canonical string from the assertion fields that must be protected.
 * This is what gets signed — deliberately excludes `signature` and `signatureStatus`.
 */
function buildSignaturePayload(assertion: Omit<VerificationAssertion, "signature" | "signatureStatus" | "_tampered" | "_originalValidUntil">): string {
  return [
    assertion.id,
    assertion.subjectId,
    assertion.documentType,
    assertion.documentRef,
    assertion.status,
    assertion.verifierDeptId,
    assertion.verifiedAt,
    assertion.validUntil,
    assertion.consentId,
    assertion.purpose,
  ].join("|");
}

/**
 * Sign a verification assertion.
 * Returns the HMAC-SHA256 hex digest.
 */
export function signAssertion(
  assertion: Omit<VerificationAssertion, "signature" | "signatureStatus" | "_tampered" | "_originalValidUntil">
): string {
  const payload = buildSignaturePayload(assertion);
  return createHmac("sha256", SECRET_KEY).update(payload).digest("hex");
}

/**
 * Verify the signature on an assertion.
 * Uses timingSafeEqual to prevent timing attacks.
 */
export function verifyAssertionSignature(assertion: VerificationAssertion): boolean {
  try {
    const { signature, signatureStatus, _tampered, _originalValidUntil, ...rest } = assertion;
    const expectedSignature = signAssertion(rest);

    const expected = Buffer.from(expectedSignature, "hex");
    const actual = Buffer.from(signature, "hex");

    if (expected.length !== actual.length) return false;
    return timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

/**
 * Tamper with an assertion by changing validUntil WITHOUT updating the signature.
 * Used only for the tampering demonstration.
 */
export function tamperAssertion(assertion: VerificationAssertion): VerificationAssertion {
  return {
    ...assertion,
    _tampered: true,
    _originalValidUntil: assertion.validUntil,
    validUntil: "2099-12-31", // Suspiciously extended date
  };
}

/**
 * Restore a tampered assertion to its original state.
 */
export function restoreAssertion(assertion: VerificationAssertion): VerificationAssertion {
  const { _tampered, _originalValidUntil, ...rest } = assertion;
  return {
    ...rest,
    validUntil: _originalValidUntil || assertion.validUntil,
    _tampered: false,
  };
}
