import { NextResponse } from "next/server";
import { processIncomingRequests } from "@/lib/request-processor";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const result = await processIncomingRequests();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Failed to process emails", error);
    return NextResponse.json(
      { error: "Failed to process requests." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return POST();
}
