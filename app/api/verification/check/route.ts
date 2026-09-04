import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAssertionsForSubject, getActiveConsent, addAuditEntry } from "@/lib/db";
import { verifyAssertionSignature } from "@/lib/signatures";
import type { CheckVerificationResult, DocumentType } from "@/lib/types";

const CheckSchema = z.object({
  subjectId: z.string().min(1),
  requiredDocuments: z.array(
    z.enum(["AADHAAR", "PAN", "DRIVING_LICENCE", "MARKSHEET", "INCOME_CERTIFICATE", "LAND_RECORD"])
  ),
  requestingDeptId: z.string().optional(),
  requestingDeptName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CheckSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { subjectId, requiredDocuments, requestingDeptId, requestingDeptName } = parsed.data;

    const consent = getActiveConsent(subjectId);
    if (!consent) {
      return NextResponse.json({
        subjectId,
        results: requiredDocuments.map((doc) => ({
          documentType: doc,
          status: "NOT_FOUND",
          assertion: null,
        })),
        alreadyVerifiedCount: 0,
        totalRequired: requiredDocuments.length,
        consentActive: false,
        message: "No active consent found for this subject.",
      });
    }

    const assertions = getAssertionsForSubject(subjectId);
    const today = new Date();

    const results: CheckVerificationResult[] = requiredDocuments.map((docType) => {
      const assertion = assertions.find((a) => a.documentType === docType);

      if (!assertion) {
        return { documentType: docType as DocumentType, status: "NOT_FOUND" };
      }

      const validUntil = new Date(assertion.validUntil);
      if (validUntil < today) {
        return { documentType: docType as DocumentType, status: "EXPIRED", assertion };
      }

      const sigValid = verifyAssertionSignature(assertion);
      if (!sigValid) {
        return {
          documentType: docType as DocumentType,
          status: "NOT_FOUND",
          assertion: { ...assertion, signatureStatus: "INVALID" as const },
        };
      }

      return {
        documentType: docType as DocumentType,
        status: "ALREADY_VERIFIED",
        assertion: { ...assertion, signatureStatus: "VALID" as const },
      };
    });

    const alreadyVerifiedCount = results.filter((r) => r.status === "ALREADY_VERIFIED").length;

    // Log reuse events
    if (requestingDeptId) {
      results
        .filter((r) => r.status === "ALREADY_VERIFIED")
        .forEach((r) => {
          addAuditEntry({
            timestamp: new Date().toISOString(),
            eventType: "ASSERTION_REUSED",
            description: `${r.documentType} verification assertion reused by ${requestingDeptName || requestingDeptId}`,
            subjectId,
            departmentId: requestingDeptId,
            assertionId: r.assertion?.id,
          });
        });
    }

    return NextResponse.json({
      subjectId,
      results,
      alreadyVerifiedCount,
      totalRequired: requiredDocuments.length,
      consentActive: true,
    });
  } catch (err) {
    console.error("[POST /api/verification/check]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
