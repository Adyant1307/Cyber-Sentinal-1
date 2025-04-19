// This file is a bridge between the Next.js frontend and the Flask backend
// It proxies requests to the Flask server

import { type NextRequest, NextResponse } from "next/server"

// Helper function to proxy requests to Flask
async function proxyToFlask(path: string, request: NextRequest) {
  const url = `http://localhost:5000${path}`

  try {
    const response = await fetch(url, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: request.method !== "GET" ? await request.text() : undefined,
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error proxying to ${url}:`, error)
    return NextResponse.json({ error: "Failed to connect to backend service" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return proxyToFlask("/api", request)
}

export async function POST(request: NextRequest) {
  return proxyToFlask("/api", request)
}
