import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const query = url.searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 })
  }

  try {
    const response = await fetch(`http://localhost:5000/api/hibp-check?query=${encodeURIComponent(query)}`)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error checking credentials:", error)
    return NextResponse.json({ error: "Failed to connect to backend service" }, { status: 500 })
  }
}
