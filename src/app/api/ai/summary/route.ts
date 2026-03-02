import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

export const dynamic = "force-dynamic";

const Req = z.object({
  roleTarget: z.string().trim().max(120).optional().default(""),
  tone: z.enum(["neutral", "confident", "direct"]).optional().default("neutral"),
  basics: z.object({
    firstName: z.string().optional().default(""),
    lastName: z.string().optional().default(""),
    headline: z.string().optional().default(""),
  }),
  experience: z
    .array(
      z.object({
        company: z.string().optional().default(""),
        title: z.string().optional().default(""),
        bullets: z.array(z.string()).optional().default([]),
      }),
    )
    .optional()
    .default([]),
  skills: z.array(z.string()).optional().default([]),
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

  const { roleTarget, tone, basics, experience, skills } = parsed.data;
  const name = `${basics.firstName} ${basics.lastName}`.trim();

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  const expLines = experience
    .slice(0, 4)
    .map((e) => {
      const t = [e.title, e.company].map((x) => x.trim()).filter(Boolean).join(" @ ") || "(role)";
      const b = (e.bullets ?? []).map((x) => x.trim()).filter(Boolean).slice(0, 3);
      return `- ${t}${b.length ? `: ${b.join(" | ")}` : ""}`;
    })
    .join("\n");

  const skillLine = skills.map((x) => x.trim()).filter(Boolean).slice(0, 18).join(", ");

  const prompt = [
    "Write a resume SUMMARY section.",
    "Constraints:",
    "- 2 to 4 lines (not bullets)",
    "- ATS-friendly (no emojis, no fancy symbols)",
    "- Specific and impact-oriented; avoid vague claims",
    "- Do not invent employers, degrees, or certifications",
    roleTarget ? `- Target role: ${roleTarget}` : "",
    `- Tone: ${tone}`,
    "",
    "Candidate:",
    name ? `Name: ${name}` : "Name: (not provided)",
    basics.headline.trim() ? `Headline: ${basics.headline.trim()}` : "Headline: (not provided)",
    expLines ? `Experience:\n${expLines}` : "Experience: (not provided)",
    skillLine ? `Skills: ${skillLine}` : "Skills: (not provided)",
    "",
    "Return only the summary text.",
  ]
    .filter(Boolean)
    .join("\n");

  const result = await client.responses.create({
    model,
    input: prompt,
  });

  const text = (result.output_text || "").trim();
  return NextResponse.json({ text });
}
