import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, AUTH_TTL_SECONDS, createAuthToken, timingSafeEqual } from "@/utils/auth";
import { RateLimiter, getClientIp } from "@/utils/rateLimit";

export const runtime = "nodejs";

// 5 attempts per 15 minutes per IP.
const loginLimiter = new RateLimiter(5, 15 * 60 * 1000);

export async function POST(request: NextRequest) {
  const correctPassword = process.env.PAGE_ACCESS_PASSWORD;

  if (!correctPassword) {
    console.error("PAGE_ACCESS_PASSWORD environment variable is not set");
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }

  const ip = getClientIp(request);
  const rate = loginLimiter.consume(ip);

  if (!rate.allowed) {
    return NextResponse.json(
      { message: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );
  }

  let password: unknown;
  try {
    const body = await request.json();
    password = body?.password;
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  if (typeof password !== "string") {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  if (!(await timingSafeEqual(password, correctPassword))) {
    return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
  }

  const token = await createAuthToken();
  if (!token) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }

  // Successful login clears the attempt counter for this IP.
  loginLimiter.reset(ip);

  const response = NextResponse.json({ success: true }, { status: 200 });

  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: AUTH_TTL_SECONDS,
    sameSite: "strict",
    path: "/",
  });

  return response;
}
