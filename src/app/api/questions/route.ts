import { NextResponse } from "next/server";
import { createQuestionRecord } from "@/lib/recall";
import { questionStore } from "@/lib/storage";
import { parseQuestionInput } from "@/lib/validation";

export const runtime = "nodejs";

function errorResponse(error: unknown, status = 400) {
  return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status });
}

export async function GET() {
  const questions = await questionStore.list();
  return NextResponse.json({ questions });
}

export async function POST(request: Request) {
  try {
    const input = parseQuestionInput(await request.json());
    const question = createQuestionRecord(input);
    const created = await questionStore.create(question);
    return NextResponse.json({ question: created }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
