import { SignJWT } from "jose";
import { NextResponse } from "next/server";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "my-super-secret-key-change-in-production"
);

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (username === "admin" && password === "password") {
    const token = await new SignJWT({
      username,
      role: "admin",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer("nextjs-jwt-demo")
      .setAudience("nextjs-jwt-demo")
      .setExpirationTime("1h")
      .sign(secret);

    return NextResponse.json({
      success: true,
      token,
      user: { username, role: "admin" },
    });
  }

  return NextResponse.json(
    { success: false, message: "Invalid credentials" },
    { status: 401 }
  );
}
