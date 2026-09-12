import { NextResponse } from "next/server";
import { redis } from "@/lib/kv";
import {
  LEADERBOARD_KEY,
  LEADERBOARD_MAX_ENTRIES,
  parseSubmission,
  type Submission,
} from "@/lib/leaderboard";

export async function GET(request: Request) {
  if (!redis) {
    return NextResponse.json({ configured: false, entries: [] as Submission[] });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(200, Math.max(1, Number(searchParams.get("limit")) || 10));

  const raw = await redis.zrange<string[]>(LEADERBOARD_KEY, 0, limit - 1, { rev: true });
  const entries = raw
    .map((item) => {
      try {
        return typeof item === "string" ? (JSON.parse(item) as Submission) : (item as Submission);
      } catch {
        return null;
      }
    })
    .filter((entry): entry is Submission => entry !== null);

  return NextResponse.json({ configured: true, entries });
}

export async function POST(request: Request) {
  if (!redis) {
    return NextResponse.json(
      { error: "No leaderboard store connected yet." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const entry = parseSubmission(body);

  await redis.zadd(LEADERBOARD_KEY, { score: entry.createdAt, member: JSON.stringify(entry) });
  await redis.zremrangebyrank(LEADERBOARD_KEY, 0, -(LEADERBOARD_MAX_ENTRIES + 1));

  return NextResponse.json({ entry });
}
