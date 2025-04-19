"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { Shield, BarChart3, Newspaper } from "lucide-react"

export default function HomePage() {
  useEffect(() => {
    // Matrix background effect
    const canvas = document.getElementById("matrix-canvas") as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const chars = "01010101010101"
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops: number[] = []

    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#0f0"
      ctx.font = fontSize + "px monospace"

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
        {/* Matrix background */}
        <div className="absolute inset-0 z-0">
          <canvas id="matrix-canvas" className="opacity-15"></canvas>
        </div>

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2 text-blue-400 neon-text">
              <Shield className="h-6 w-6" />
              <span className="text-xl font-bold">Cyber Sentinel</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300 neon-text"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-blue-400"
              >
                Dashboard
              </Link>
              <Link
                href="/news"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-blue-400"
              >
                News
              </Link>
              <ModeToggle />
            </div>
          </div>
        </header>

        {/* Hero section */}
        <section className="relative z-10 flex min-h-screen w-full max-w-7xl flex-col items-center justify-center px-4 text-center">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl font-bold leading-tight text-blue-400 neon-text sm:text-5xl md:text-6xl">
              Cyber Sentinel
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Live threat detection and breach awareness for everyday users. Monitor cybersecurity news and dark web
              data in real-time with advanced machine learning.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="gap-2 px-8 text-lg neon-card bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
                >
                  <BarChart3 className="h-5 w-5" />
                  Launch Dashboard
                </Button>
              </Link>
              <Link href="/news">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 px-8 text-lg neon-card border-blue-400/50 text-blue-400 hover:text-blue-300"
                >
                  <Newspaper className="h-5 w-5" />
                  View News
                </Button>
              </Link>
            </div>
            <div className="mt-8 rounded-lg border border-blue-400/30 bg-card/50 p-6 backdrop-blur-sm neon-card">
              <h3 className="mb-4 text-xl font-semibold text-blue-400 neon-text">Project Team</h3>
              <p className="text-sm text-muted-foreground">
                8th Semester Major Project by{" "}
                <span className="font-medium text-foreground">Aaryan Jordan (2128001)</span>,{" "}
                <span className="font-medium text-foreground">Adyant Verma (2128006)</span>,{" "}
                <span className="font-medium text-foreground">Akul Akand (2128008)</span>, under the Project Guide,{" "}
                <span className="font-medium text-foreground">Professor Suchismita Das</span>.
              </p>
            </div>
          </div>
        </section>
      </div>
    </ThemeProvider>
  )
}
