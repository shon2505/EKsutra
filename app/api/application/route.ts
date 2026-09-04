import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { addApplication, addAuditEntry, db } from "@/lib/db";
import type { Application, DocumentType } from "@/lib/types";

const ApplicationSchema = z.object({
  subjectId: z.string().min(1),
  subjectName: z.string().min(1),
  departmentId: z.string().min(1),
  departmentName: z.string().min(1),
  serviceName: z.string().min(1),
  documentsRequired: z.array(z.string()),
  documentsVerified: z.array(z.string()),
  applicationRef: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const allVerified = data.documentsRequired.every((d) =>
      data.documentsVerified.includes(d)
    );

    const now = new Date().toISOString();
    const app: Application = {
      id: `APP-${uuidv4().slice(0, 8).toUpperCase()}`,
      applicationRef:
        data.applicationRef ||
        `SCH-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
      subjectId: data.subjectId,
      subjectName: data.subjectName,
      departmentId: data.departmentId,
      departmentName: data.departmentName,
      serviceName: data.serviceName,
      documentsRequired: data.documentsRequired as DocumentType[],
      documentsVerified: data.documentsVerified as DocumentType[],
      status: allVerified ? "READY_FOR_REVIEW" : "IN_PROGRESS",
      createdAt: now,
      updatedAt: now,
    };

    addApplication(app);
    addAuditEntry({
      timestamp: now,
      eventType: allVerified ? "APPLICATION_COMPLETED" : "APPLICATION_CREATED",
      description: allVerified
        ? `Application ${app.applicationRef} completed — all documents verified`
        : `Application ${app.applicationRef} created — verification in progress`,
      subjectId: data.subjectId,
      departmentId: data.departmentId,
      applicationId: app.id,
    });

    return NextResponse.json({ success: true, application: app });
  } catch (err) {
    console.error("[POST /api/application]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ applications: db.applications });
}
