import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const webhook =
      "https://hook.us2.make.com/685m5t1n8mbrsw27es0jar8s1tqb2ns7";

    const makeRes = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await makeRes.text();

    if (!makeRes.ok) {
      console.error("MAKE ERROR:", text);
      return NextResponse.json(
        { ok: false, error: text },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("API ERROR:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
