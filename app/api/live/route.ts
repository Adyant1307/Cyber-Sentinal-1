import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const response = await fetch("http://localhost:5000/api/live")
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching live threats:", error)
    return NextResponse.json({ error: "Failed to connect to backend service" }, { status: 500 })
  }
}
