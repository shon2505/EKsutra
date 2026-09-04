import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db, addAuditEntry } from "@/lib/db";
import { restoreAssertion } from "@/lib/signatures";

const RestoreSchema = z.object({
  assertionId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RestoreSchema.safeParse(body);

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

    const restored = restoreAssertion(db.assertions[idx]);
    db.assertions[idx] = restored;
    db.demoState.tamperedAssertionId = undefined;

    addAuditEntry({
      timestamp: new Date().toISOString(),
      eventType: "ASSERTION_RESTORED",
      description: `[DEMO] Assertion ${assertionId} restored to original signed state`,
      assertionId,
    });

    return NextResponse.json({
      success: true,
      message: "Assertion restored to original signed state.",
      assertionId,
    });
  } catch (err) {
    console.error("[POST /api/demo/restore]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
