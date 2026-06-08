import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker");

  if (!ticker) {
    return NextResponse.json({ error: "Ticker is required" }, { status: 400 });
  }

  let yahooTicker = ticker.toUpperCase();
  if (yahooTicker === "BTC") yahooTicker = "BTC-USD";
  if (yahooTicker === "ETH") yahooTicker = "ETH-USD";

  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${yahooTicker}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Yahoo API error" },
        { status: response.status },
      );
    }

    const data = await response.json();
    const result = data?.quoteResponse?.result?.[0];

    if (!result) {
      return NextResponse.json({ error: "Ticker not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
