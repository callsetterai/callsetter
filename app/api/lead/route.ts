import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WEBHOOK =
  "https://hook.us2.make.com/685m5t1n8mbrsw27es0jar8s1tqb2ns7";

export async function GET() {
  // Helpful sanity check: visit /api/lead in browser
  return NextResponse.json({ ok: true, route: "/api/lead", method: "GET" });
}

export async function POST(req: Request) {
  try {
    let payload: any = null;

    // Some environments can throw on req.json() if body is empty/invalid.
    try {
      payload = await req.json();
    } catch (e: any) {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON body", details: e?.message || String(e) },
        { status: 400 }
      );
    }

    // Basic validation to avoid sending junk
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
        // Some webhook providers behave better with a user-agent
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

    // Make often returns empty body — that's fine.
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error("API /api/lead ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Server error", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
