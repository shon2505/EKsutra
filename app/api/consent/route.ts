import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { db, addConsent, addAuditEntry } from "@/lib/db";
import type { ConsentRecord } from "@/lib/types";

const ConsentSchema = z.object({
  subjectId: z.string().min(1),
  subjectName: z.string().min(1),
  issuingDeptId: z.string().min(1),
  issuingDeptName: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ConsentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { subjectId, subjectName, issuingDeptId, issuingDeptName } = parsed.data;

    // Deactivate any existing consent for this subject
    db.consents.forEach((c) => {
      if (c.subjectId === subjectId) c.isActive = false;
    });

    const consent: ConsentRecord = {
      id: `CONSENT-${uuidv4().slice(0, 8).toUpperCase()}`,
      subjectId,
      subjectName,
      grantedAt: new Date().toISOString(),
      issuingDeptId,
      issuingDeptName,
      permissions: ["STORE_VERIFICATION_STATUS", "ALLOW_AUTHORIZED_REUSE"],
      isActive: true,
    };

    addConsent(consent);
    addAuditEntry({
      timestamp: new Date().toISOString(),
      eventType: "CONSENT_GRANTED",
      description: `${subjectName} gave consent for verification reuse via ${issuingDeptName}`,
      subjectId,
      departmentId: issuingDeptId,
    });

    return NextResponse.json({ success: true, consent });
  } catch (err) {
    console.error("[POST /api/consent]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
