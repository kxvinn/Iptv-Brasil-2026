import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function OPTIONS(req: NextRequest) {
    return new NextResponse(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        },
    });
}

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    try {
        const controller = new AbortController();
        // Give it a bit more time for the initial connection
        const timeout = setTimeout(() => controller.abort(), 15000);

        const upstream = await fetch(url, {
            signal: controller.signal,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept: "*/*",
                Referer: new URL(url).origin + "/",
            },
            // We want to follow redirects so the final stream is fetched
            redirect: "follow",
        });

        clearTimeout(timeout);

        if (!upstream.ok) {
            return NextResponse.json(
                { error: `Upstream returned ${upstream.status}` },
                { status: upstream.status, headers: { "Access-Control-Allow-Origin": "*" } }
            );
        }

        const contentType = upstream.headers.get("content-type") || "application/octet-stream";
        const body = upstream.body;

        if (!body) {
            return NextResponse.json({ error: "Empty response" }, { status: 502, headers: { "Access-Control-Allow-Origin": "*" } });
        }

        // For m3u8 playlists, rewrite internal URLs to also go through proxy
        if (contentType.includes("mpegurl") || url.includes(".m3u8")) {
            const text = await upstream.text();

            // The base URL for relative paths is the URL, up to the last slash
            const baseUrl = url.substring(0, url.lastIndexOf("/") + 1);

            const rewritten = text
                .split("\n")
                .map((line) => {
                    const trimmed = line.trim();
                    if (trimmed && !trimmed.startsWith("#")) {
                        // It's a URL line — make it absolute and proxy it
                        let absoluteUrl = trimmed;
                        if (!trimmed.startsWith("http")) {
                            absoluteUrl = baseUrl + trimmed;
                        }
                        return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`;
                    }
                    return line;
                })
                .join("\n");

            return new NextResponse(rewritten, {
                headers: {
                    "Content-Type": "application/vnd.apple.mpegurl",
                    "Access-Control-Allow-Origin": "*",
                    "Cache-Control": "no-cache",
                },
            });
        }

        // For TS segments and other binary data, stream through
        return new NextResponse(body, {
            headers: {
                "Content-Type": contentType,
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-cache",
            },
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 502, headers: { "Access-Control-Allow-Origin": "*" } });
    }
}
