import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { addAssertion, addAuditEntry, db } from "@/lib/db";
import { signAssertion } from "@/lib/signatures";
import type { VerificationAssertion, DocumentType } from "@/lib/types";

const CreateSchema = z.object({
  subjectId: z.string().min(1),
  subjectName: z.string().min(1),
  documentType: z.enum([
    "AADHAAR",
    "PAN",
    "DRIVING_LICENCE",
    "MARKSHEET",
    "INCOME_CERTIFICATE",
    "LAND_RECORD",
  ]),
  documentRef: z.string().min(1),
  verifierDeptId: z.string().min(1),
  verifiedBy: z.string().min(1),
  consentId: z.string().min(1),
  purpose: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    // Check demo failure flag
    if (db.demoState.failureEnabled) {
      // Simulate transient failure
      return NextResponse.json(
        {
          error: "DEPARTMENT_UNAVAILABLE",
          message: "Department service temporarily unavailable.",
          retrying: true,
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const parsed = CreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const today = new Date();
    const validUntil = new Date(today);
    validUntil.setDate(today.getDate() + 30);

    const assertionBase = {
      id: `ASSERT-${uuidv4().slice(0, 8).toUpperCase()}`,
      subjectId: data.subjectId,
      subjectName: data.subjectName,
      documentType: data.documentType as DocumentType,
      documentRef: data.documentRef,
      status: "VERIFIED" as const,
      verifiedBy: data.verifiedBy,
      verifierDeptId: data.verifierDeptId,
      verifiedAt: today.toISOString().split("T")[0],
      validUntil: validUntil.toISOString().split("T")[0],
      purpose: data.purpose,
      consentId: data.consentId,
    };

    const signature = signAssertion(assertionBase);
    const assertion: VerificationAssertion = {
      ...assertionBase,
      signature,
      signatureStatus: "VALID",
    };

    addAssertion(assertion);
    addAuditEntry({
      timestamp: new Date().toISOString(),
      eventType: "ASSERTION_CREATED",
      description: `${data.documentType} verification assertion created and signed for ${data.subjectName}`,
      subjectId: data.subjectId,
      departmentId: data.verifierDeptId,
      assertionId: assertion.id,
    });

    return NextResponse.json({ success: true, assertion });
  } catch (err) {
    console.error("[POST /api/verification/create]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
