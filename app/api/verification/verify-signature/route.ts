import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyAssertionSignature } from "@/lib/signatures";

const VerifySchema = z.object({
  assertionId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = VerifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { assertionId } = parsed.data;
    const assertion = db.assertions.find((a) => a.id === assertionId);

    if (!assertion) {
      return NextResponse.json({ error: "Assertion not found" }, { status: 404 });
    }

    const isValid = verifyAssertionSignature(assertion);

    return NextResponse.json({
      assertionId,
      signatureStatus: isValid ? "VALID" : "INVALID",
      tampered: assertion._tampered ?? false,
      details: isValid
        ? "Digital signature validated successfully. Assertion integrity confirmed."
        : "Digital signature validation FAILED. The assertion may have been modified after signing.",
    });
  } catch (err) {
    console.error("[POST /api/verification/verify-signature]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
