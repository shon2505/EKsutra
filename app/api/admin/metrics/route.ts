import { NextResponse } from "next/server";
import { getAdminMetrics, db } from "@/lib/db";

export async function GET() {
  try {
    const metrics = getAdminMetrics();
    return NextResponse.json({
      ...metrics,
      departments: db.departments,
      recentApplications: [...db.applications]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 10),
    });
  } catch (err) {
    console.error("[GET /api/admin/metrics]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
