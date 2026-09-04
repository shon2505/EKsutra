import { NextRequest, NextResponse } from "next/server";
import { getAssertionsForSubject, getActiveConsent } from "@/lib/db";
import { verifyAssertionSignature } from "@/lib/signatures";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  try {
    const { subjectId } = await params;

    if (!subjectId) {
      return NextResponse.json({ error: "subjectId is required" }, { status: 400 });
    }

    const assertions = getAssertionsForSubject(subjectId);
    const consent = getActiveConsent(subjectId);

    // Annotate each assertion with current signature validity
    const annotated = assertions.map((a) => ({
      ...a,
      signatureStatus: verifyAssertionSignature(a) ? "VALID" : "INVALID",
    }));

    return NextResponse.json({
      subjectId,
      assertions: annotated,
      hasActiveConsent: !!consent,
      consent: consent || null,
    });
  } catch (err) {
    console.error("[GET /api/verification/:subjectId]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
