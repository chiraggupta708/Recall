import { NextResponse } from "next/server";
import { questionStore } from "@/lib/storage";
import { parseReviewGrade } from "@/lib/validation";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function errorResponse(error: unknown, status = 400) {
  return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status });
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const grade = parseReviewGrade(await request.json());
    const question = await questionStore.review(id, grade);

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ question });
  } catch (error) {
    return errorResponse(error);
  }
}
