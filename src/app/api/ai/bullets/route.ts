import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

export const dynamic = "force-dynamic";

const Req = z.object({
  roleTarget: z.string().trim().max(120).optional().default(""),
  tone: z.enum(["neutral", "confident", "direct"]).optional().default("neutral"),
  title: z.string().trim().max(120).optional().default(""),
  company: z.string().trim().max(120).optional().default(""),
  bullets: z.array(z.string()).min(1).max(12),
});

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
  }

  const json = await req.json().catch(() => null);
  const parsed = Req.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { roleTarget, tone, title, company, bullets } = parsed.data;
  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  const prompt = [
    "Rewrite these resume bullets to be stronger.",
    "Constraints:",
    "- Keep each bullet to one line when possible",
    "- Start with a strong verb",
    "- Prefer outcomes + metrics when provided",
    "- Do not invent metrics or tools",
    "- Keep meaning consistent",
    "- ATS-friendly (no emojis, no fancy symbols)",
    roleTarget ? `- Target role: ${roleTarget}` : "",
    `- Tone: ${tone}`,
    "",
    "Context:",
    [title, company].map((x) => x.trim()).filter(Boolean).length
      ? `Role: ${[title.trim(), company.trim()].filter(Boolean).join(" @ ")}`
      : "Role: (not provided)",
    "",
    "Input bullets:",
    ...bullets.map((b, i) => `${i + 1}. ${b}`),
    "",
    "Return a JSON array of strings (same length, same order).",
  ]
    .filter(Boolean)
    .join("\n");

  const result = await client.responses.create({
    model,
    input: prompt,
  });

  const text = (result.output_text || "").trim();

  // Best-effort parse; fallback to splitting lines.
  try {
    const arr = JSON.parse(text);
    if (Array.isArray(arr) && arr.every((x) => typeof x === "string")) {
      return NextResponse.json({ bullets: arr });
    }
  } catch {
    // ignore
  }

  const fallback = text
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-\d.]+\s*/, "").trim())
    .filter(Boolean);
  const out = bullets.map((b, i) => fallback[i] || b);
  return NextResponse.json({ bullets: out });
}
