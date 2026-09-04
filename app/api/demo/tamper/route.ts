import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db, addAuditEntry } from "@/lib/db";
import { tamperAssertion } from "@/lib/signatures";

const TamperSchema = z.object({
  assertionId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = TamperSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { assertionId } = parsed.data;
    const idx = db.assertions.findIndex((a) => a.id === assertionId);

    if (idx < 0) {
      return NextResponse.json({ error: "Assertion not found" }, { status: 404 });
    }

    const tampered = tamperAssertion(db.assertions[idx]);
    db.assertions[idx] = tampered;
    db.demoState.tamperedAssertionId = assertionId;

    addAuditEntry({
      timestamp: new Date().toISOString(),
      eventType: "ASSERTION_TAMPERED",
      description: `[DEMO] Assertion ${assertionId} tampered — validUntil modified without updating signature`,
      assertionId,
    });

    return NextResponse.json({
      success: true,
      message: "Assertion tampered for demonstration. validUntil modified without updating signature.",
      tamperedField: "validUntil",
      newValue: tampered.validUntil,
      originalValue: tampered._originalValidUntil,
      assertionId,
    });
  } catch (err) {
    console.error("[POST /api/demo/tamper]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
