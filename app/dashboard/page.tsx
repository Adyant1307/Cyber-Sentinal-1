"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Shield, Search, RefreshCw, Globe, Lock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ThreatMeter } from "@/components/threat-meter"
import { BreachCard } from "@/components/breach-card"
import { DarkwebCard } from "@/components/darkweb-card"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<string>("-")
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [threatCount, setThreatCount] = useState(0)
  const [darkwebCount, setDarkwebCount] = useState(0)
  const [breachCount, setBreachCount] = useState(0)
  const [breachData, setBreachData] = useState<any[]>([])
  const [newsData, setNewsData] = useState<any[]>([])
  const [darkwebData, setDarkwebData] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [globalStatsData, setGlobalStatsData] = useState([
    {
      title: "Active Threats",
      value: 0,
      icon: <AlertTriangle className="h-4 w-4" />,
      description: "Worldwide today",
      color: "text-red-500",
    },
    {
      title: "Breached Accounts",
      value: 0,
      icon: <Lock className="h-4 w-4" />,
      description: "In the last 24 hours",
      color: "text-amber-500",
    },
    {
      title: "Vulnerabilities",
      value: 0,
      icon: <Shield className="h-4 w-4" />,
      description: "Discovered this week",
      color: "text-blue-500",
    },
    {
      title: "Attacks Blocked",
      value: 0,
      icon: <Globe className="h-4 w-4" />,
      description: "In the last 24 hours",
      color: "text-green-500",
    },
  ])

  // Update global stats with random values
  useEffect(() => {
    setGlobalStatsData([
      {
        ...globalStatsData[0],
        value: Math.floor(Math.random() * 1000) + 500,
      },
      {
        ...globalStatsData[1],
        value: Math.floor(Math.random() * 10000000) + 5000000,
      },
      {
        ...globalStatsData[2],
        value: Math.floor(Math.random() * 5000) + 1000,
      },
      {
        ...globalStatsData[3],
        value: Math.floor(Math.random() * 1000000) + 500000,
      },
    ])
  }, [])

  // Update last refresh time
  const updateLastRefreshTime = () => {
    if (typeof window !== 'undefined') {
      const now = new Date()
      setLastRefresh(now.toLocaleTimeString())
    }
  }

  // Fetch all data
  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      await Promise.all([
        fetchLiveThreats(),
        fetchDarkwebThreats(),
      ])
      updateLastRefreshTime()
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch live threats
  const fetchLiveThreats = async () => {
    try {
      const res = await fetch("/api/live")
      if (!res.ok) {
        console.error("Error fetching live threats: Server responded with", res.status)
        setNewsData([])
        setThreatCount(0)
        return []
      }

      const data = await res.json()
      if (!Array.isArray(data)) {
        console.error("Invalid response format from /api/live")
        setNewsData([])
        setThreatCount(0)
        return []
      }

      setNewsData(data)
      const count = data.filter((item) => item?.status === "Threat").length
      setThreatCount(count)
      return data
    } catch (error) {
      console.error("Error fetching live threats:", error)
      setNewsData([])
      setThreatCount(0)
      return []
    }
  }

  // Fetch darkweb threats
  const fetchDarkwebThreats = async () => {
    try {
      const res = await fetch("/api/darkweb")
      if (!res.ok) {
        console.error("Error fetching darkweb threats: Server responded with", res.status)
        setDarkwebData([])
        setDarkwebCount(0)
        return []
      }

      const data = await res.json()
      if (!Array.isArray(data)) {
        console.error("Invalid response format from /api/darkweb")
        setDarkwebData([])
        setDarkwebCount(0)
        return []
      }

      setDarkwebData(data)
      const count = data.filter((item) => item?.status === "Threat").length
      setDarkwebCount(count)
      return data
    } catch (error) {
      console.error("Error fetching darkweb threats:", error)
      setDarkwebData([])
      setDarkwebCount(0)
      return []
    }
  }

  // Check credentials
  const checkCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      const res = await fetch(`/api/hibp-check?query=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()

      if (data.error) {
        setBreachData([])
        setBreachCount(0)
      } else {
        setBreachData(data)
        setBreachCount(data.length)
      }
    } catch (error) {
      console.error("Error checking credentials:", error)
      setBreachData([])
      setBreachCount(0)
    }
  }

  // Toggle auto refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh)
  }

  // Initialize dashboard
  useEffect(() => {
    fetchAllData()

    // Set up auto refresh
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(fetchAllData, 120000) // 2 minutes
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  // Generate mock breach data if none exists
  useEffect(() => {
    if (breachData.length === 0 && !isLoading) {
      const mockBreaches = [
        { leak: "LinkedIn: user@example.com", password: "********" },
        { leak: "Adobe: user@example.com", password: "" },
        { leak: "Dropbox: user@example.com", password: "********" },
      ]
      setBreachData(mockBreaches)
      setBreachCount(mockBreaches.length)
    }
  }, [isLoading, breachData])

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background compact-layout">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-blue-400 neon-text">
            <Shield className="h-5 w-5" />
            <span className="text-lg font-bold">Cyber Sentinel</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-medium text-foreground/80 transition-colors hover:text-blue-400">
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-medium text-blue-400 transition-colors hover:text-blue-300 neon-text"
            >
              Dashboard
            </Link>
            <Link
              href="/news"
              className="text-xs font-medium text-foreground/80 transition-colors hover:text-blue-400"
            >
              News
            </Link>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto w-full max-w-7xl px-4 py-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-400 neon-text">Security Dashboard</h1>
            <p className="text-xs text-muted-foreground">
              Monitor threats, check for breaches, and track dark web activity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={toggleAutoRefresh} />
              <Label htmlFor="auto-refresh" className="text-xs text-muted-foreground">
                Auto-refresh: {autoRefresh ? "ON" : "OFF"}
              </Label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAllData}
              className="h-8 gap-1 text-xs neon-card border-blue-400/30 text-blue-400"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left Column - Stats and Breach Checker */}
          <div className="col-span-12 lg:col-span-8">
            {/* Summary stats */}
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {globalStatsData.map((stat, index) => (
                <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm neon-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{stat.title}</p>
                        <p className="mt-1 text-xl font-bold text-blue-400 neon-text">
                          {stat.value.toLocaleString()}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
                      </div>
                      <div className="rounded-full bg-blue-500/10 p-3 text-blue-400">{stat.icon}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Breach checker */}
            <Card className="mb-4 border-border/50 bg-card/50 backdrop-blur-sm neon-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-400 neon-text">Credential Breach Check</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={checkCredentials} className="mb-4 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Enter email, username, or phone number"
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="neon-card bg-blue-500/20 hover:bg-blue-500/30 text-blue-400">
                    Check
                  </Button>
                </form>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {breachData.slice(0, 3).map((breach, index) => (
                    <BreachCard key={index} breach={breach} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Threat Monitoring */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm neon-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-blue-400 neon-text">Threat Monitoring</CardTitle>
                  <Link href="/news" className="text-xs text-blue-400 hover:text-blue-300 neon-text">
                    View all threats →
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm neon-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Active Threats</p>
                          <ThreatMeter value={threatCount} maxValue={10} className="my-2" />
                          <p className="text-lg font-bold text-blue-400 neon-text">{threatCount}</p>
                        </div>
                        <div className="rounded-full bg-red-500/10 p-3 text-red-500">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm neon-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Dark Web Threats</p>
                          <ThreatMeter value={darkwebCount} maxValue={10} className="my-2" />
                          <p className="text-lg font-bold text-blue-400 neon-text">{darkwebCount}</p>
                        </div>
                        <div className="rounded-full bg-amber-500/10 p-3 text-amber-500">
                          <Globe className="h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm neon-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Breaches Found</p>
                          <ThreatMeter value={breachCount} maxValue={10} className="my-2" />
                          <p className="text-lg font-bold text-blue-400 neon-text">{breachCount}</p>
                        </div>
                        <div className="rounded-full bg-blue-500/10 p-3 text-blue-500">
                          <Lock className="h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Dark Web Threats */}
          <div className="col-span-12 lg:col-span-4">
            {/* Dark Web Threats */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm neon-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-blue-400 neon-text">Dark Web Threats</CardTitle>
                  <Link href="/news" className="text-xs text-blue-400 hover:text-blue-300 neon-text">
                    View all →
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {darkwebData.slice(0, 5).map((threat, index) => (
                    <DarkwebCard key={index} threat={threat} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Last updated info */}
        <div className="mt-4 flex items-center justify-center text-center text-xs text-muted-foreground">
          <p>
            Last updated: <span className="font-medium text-foreground">{lastRefresh}</span> | Visit the{" "}
            <Link href="/news" className="text-blue-400 hover:underline neon-text">
              News page
            </Link>{" "}
            for detailed cybersecurity updates
          </p>
        </div>
      </main>
    </div>
  )
}
