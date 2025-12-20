import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ✅ UPDATED webhook URL (n8n)
const WEBHOOK = "https://callsetter.app.n8n.cloud/webhook/form-opt-in";

export async function GET() {
  // sanity check route
  return NextResponse.json({ ok: true, route: "/api/lead", method: "GET" });
}

export async function POST(req: Request) {
  try {
    let payload: any = null;

    try {
      payload = await req.json();
    } catch (e: any) {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON body", details: e?.message || String(e) },
        { status: 400 }
      );
    }

    if (!payload?.name || !payload?.email || !payload?.phone) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: name, email, phone" },
        { status: 400 }
      );
    }

    const makeRes = await fetch(WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "callsetter-vercel-api/1.0",
      },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    const text = await makeRes.text().catch(() => "");

    if (!makeRes.ok) {
      console.error("MAKE WEBHOOK FAILED:", makeRes.status, text);
      return NextResponse.json(
        {
          ok: false,
          error: "Make webhook rejected the request",
          status: makeRes.status,
          response: text || "(empty response body)",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error("API /api/lead ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Server error", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
