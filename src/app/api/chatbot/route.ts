import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  person,
  social,
  home,
  about,
} from "@/resources/content";

// ── helpers ─────────────────────────────────────────────────────────────────

/** Strip JSX / React elements so we get plain text for the system prompt */
function jsxToText(value: unknown, depth = 0): string {
  if (depth > 8) return "";
  if (value === null || value === undefined || typeof value === "boolean")
    return "";
  if (typeof value === "string" || typeof value === "number")
    return String(value);
  if (Array.isArray(value)) return value.map((v) => jsxToText(v, depth)).join(" ");
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    // React element
    if (obj.props) {
      const children = obj.props as { children?: unknown };
      return jsxToText(children.children, depth + 1);
    }
    // Plain object — stringify values
    return Object.values(obj)
      .map((v) => jsxToText(v, depth + 1))
      .join(" ");
  }
  return "";
}

function buildSystemPrompt(): string {
  const contactLinks = social
    .map((s) => `- ${s.name}: ${s.link}`)
    .join("\n");

  const experiences = about.work.experiences
    .map((exp) => {
      const achievements = exp.achievements
        .map((a) => `  • ${jsxToText(a)}`)
        .join("\n");
      return `  ${exp.company} | ${exp.role} | ${exp.timeframe}\n  ${jsxToText(exp.description)}\n${achievements}`;
    })
    .join("\n\n");

  const institutions = about.studies.institutions
    .map((i) => `  - ${i.name}: ${jsxToText(i.description)}`)
    .join("\n");

  const certifications = about.certifications.items
    .map((c) => `  - ${c.name} (${c.institution})`)
    .join("\n");

  const skills = about.technical.skills
    .map((s) => `  ${s.title}: ${jsxToText(s.description)}`)
    .join("\n");

  const featuredProject = `${jsxToText(home.featured?.title)} — ${home.featured?.href}`;

  return `You are Erick Chatbot, an assistant on Erick Mahecha's portfolio website.

## ABOUT ERICK
Name: ${person.name}
Role: ${person.role}
Location: ${person.location}
Email: ${person.email}
Languages: ${person.languages?.join(", ")}

## BIO
${jsxToText(about.intro.description)}

## WORK EXPERIENCE
${experiences}

## EDUCATION
${institutions}

## CERTIFICATIONS
${certifications}

## TECHNICAL SKILLS
${skills}

## FEATURED PROJECT
${featuredProject}

## CONTACT LINKS
${contactLinks}

## RULES
You can ONLY answer questions about Erick, his professional experience, skills, and projects, using EXCLUSIVELY the information provided above. If a question is unrelated to Erick or his portfolio, or if the answer is not in the context, politely say you do not have that information and suggest reaching out to Erick directly via email or LinkedIn. Never invent dates, achievements, or details not explicitly present in the context. Keep responses professional but approachable, and under 4 sentences.`;
}

// ── rate limit ───────────────────────────────────────────────────────────────

const SESSION_LIMIT = 8;
const MSG_MAX_CHARS = 300;
// In-memory server-side store (per deployment instance — adequate for free tier)
const sessionCounts = new Map<string, number>();

function getSessionId(req: NextRequest): string {
  return (
    req.cookies.get("chatbot_sid")?.value ??
    crypto.randomUUID()
  );
}

// ── route ────────────────────────────────────────────────────────────────────

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Service temporarily unavailable." },
      { status: 503 },
    );
  }

  // Session tracking
  const sid = getSessionId(req);
  const count = sessionCounts.get(sid) ?? 0;

  if (count >= SESSION_LIMIT) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  // Parse body
  let message: string;
  try {
    const body = await req.json();
    message = String(body.message ?? "").trim().slice(0, MSG_MAX_CHARS);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json({ error: "Empty message." }, { status: 400 });
  }

  // Call Gemini
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: buildSystemPrompt(),
    });

    const result = await model.generateContent(message);
    const text = result.response.text();

    // Increment counter
    sessionCounts.set(sid, count + 1);

    const response = NextResponse.json({
      reply: text,
      remaining: SESSION_LIMIT - (count + 1),
    });

    // Set cookie if new session
    if (!req.cookies.get("chatbot_sid")) {
      response.cookies.set("chatbot_sid", sid, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 h
        path: "/",
      });
    }

    return response;
  } catch (err) {
    console.error("[chatbot] Gemini error:", err);
    return NextResponse.json({ error: "api_error" }, { status: 500 });
  }
}
