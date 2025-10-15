import { NextResponse } from "next/server";
import { DemoResponse } from "@shared/api";

export function GET() {
  const response: DemoResponse = {
    message: "Hello from Next.js API route",
  };

  return NextResponse.json(response, { status: 200 });
}
