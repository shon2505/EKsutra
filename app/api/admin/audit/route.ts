import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const audit = [...db.audit].slice(0, 50); // Most recent 50 entries
    return NextResponse.json({ audit, total: db.audit.length });
  } catch (err) {
    console.error("[GET /api/admin/audit]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
