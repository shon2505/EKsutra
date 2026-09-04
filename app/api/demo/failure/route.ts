import { NextRequest, NextResponse } from "next/server";
import { db, addAuditEntry } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const enable = body.enable !== undefined ? Boolean(body.enable) : !db.demoState.failureEnabled;

    db.demoState.failureEnabled = enable;

    addAuditEntry({
      timestamp: new Date().toISOString(),
      eventType: enable ? "DEMO_FAILURE_ENABLED" : "DEMO_FAILURE_DISABLED",
      description: enable
        ? "Simulated department API failure activated (demo mode)"
        : "Simulated department API failure deactivated",
    });

    return NextResponse.json({
      success: true,
      failureEnabled: db.demoState.failureEnabled,
      message: enable
        ? "Department API failure simulation enabled. Next verification will fail then retry."
        : "Department API failure simulation disabled.",
    });
  } catch (err) {
    console.error("[POST /api/demo/failure]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ failureEnabled: db.demoState.failureEnabled });
}
