import { NextResponse } from "next/server";
import { adminCookie, createAdminToken, passwordMatches } from "@/lib/admin-auth";

export async function POST(request: Request) {
  let body: { password?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "So'rov formati noto'g'ri" }, { status: 400 }); }
  if (typeof body.password !== "string" || !passwordMatches(body.password)) {
    return NextResponse.json({ error: "Parol noto'g'ri" }, { status: 401 });
  }
  try {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(adminCookie.name, createAdminToken(), {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
      path: "/", maxAge: adminCookie.maxAge,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Admin xavfsizlik kaliti sozlanmagan. APP_SECRET sozlang." }, { status: 503 });
  }
}
