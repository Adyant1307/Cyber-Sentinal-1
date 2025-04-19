"use client"

import { Copy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface BreachCardProps {
  breach: {
    leak: string
    password?: string
  }
}

export function BreachCard({ breach }: BreachCardProps) {
  // Determine severity based on password presence
  const severity = breach.password && breach.password.length > 0 ? "High" : "Low"

  // Extract breach name (before the colon)
  let breachName = breach.leak
  if (breachName.includes(":")) {
    breachName = breachName.split(":")[0].trim()
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${breach.leak}: ${breach.password || "No password exposed"}`)
    toast({
      title: "Copied to clipboard",
      description: "Breach details copied to clipboard",
    })
  }

  return (
    <Card
      className={`border-l-4 ${severity === "High" ? "border-l-red-500" : "border-l-amber-500"} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg neon-card`}
    >
      <CardHeader className="flex flex-row items-start justify-between p-3 pb-0">
        <div>
          <CardTitle className="text-sm font-bold">{breachName}</CardTitle>
          <p className="text-xs text-muted-foreground">Breach detected</p>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyToClipboard}>
          <Copy className="h-3 w-3" />
          <span className="sr-only">Copy details</span>
        </Button>
      </CardHeader>
      <CardContent className="p-3">
        <div className="mb-2 space-y-1 text-xs">
          <p>
            <span className="font-medium">Compromised data:</span> Email,
            {breach.password ? "Password" : "Username"}, Personal Info
          </p>
          <p>
            <span className="font-medium">Password exposed:</span>
            {breach.password ? "Yes (hidden for security)" : "No"}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant={severity === "High" ? "destructive" : "warning"} className="text-xs">
            {severity} Severity
          </Badge>
          <a
            href="https://haveibeenpwned.com/API/v2"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 neon-text"
          >
            HIBP API
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
