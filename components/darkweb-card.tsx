"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface DarkwebCardProps {
  threat: {
    post: string
    status: string
    threat_level: string
    time: string
  }
}

export function DarkwebCard({ threat }: DarkwebCardProps) {
  const isThreat = threat.status === "Threat"

  const getBadgeVariant = () => {
    if (!isThreat) return "secondary"
    if (threat.threat_level === "High") return "destructive"
    if (threat.threat_level === "Medium") return "warning"
    return "default"
  }

  const getBadgeText = () => {
    if (!isThreat) return "Safe"
    return `${threat.threat_level} Threat`
  }

  const getBorderColor = () => {
    if (!isThreat) return "border-l-green-500"
    if (threat.threat_level === "High") return "border-l-red-500"
    if (threat.threat_level === "Medium") return "border-l-amber-500"
    return "border-l-blue-500"
  }

  // Generate an appropriate image based on the content
  const getImageUrl = () => {
    const post = threat.post.toLowerCase()

    if (post.includes("credential") || post.includes("password") || post.includes("login")) {
      return "https://images.unsplash.com/photo-1614064642639-e398cf05badb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
    }
    if (post.includes("database") || post.includes("dump") || post.includes("leak")) {
      return "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
    }
    if (post.includes("exploit") || post.includes("zero-day")) {
      return "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
    }
    if (post.includes("botnet") || post.includes("ddos")) {
      return "https://images.unsplash.com/photo-1563206767-5b18f218e8de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
    }
    if (post.includes("credit card") || post.includes("skimming")) {
      return "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
    }

    // Default image
    return "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  }

  return (
    <Card
      className={`border-l-4 ${getBorderColor()} bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg neon-card h-full`}
    >
      <div className="relative h-32 overflow-hidden">
        <img src={getImageUrl() || "/placeholder.svg"} alt="Dark Web Threat" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      <CardContent className="p-3">
        <div className="mb-2 font-mono text-xs line-clamp-2">{threat.post}</div>
        <div className="flex items-center justify-between">
          <Badge variant={getBadgeVariant()} className="text-xs">
            {getBadgeText()}
          </Badge>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{threat.time}</span>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                alert(`Detailed analysis for threat: ${threat.post}`)
              }}
              className="text-xs text-blue-400 hover:text-blue-300 neon-text"
            >
              Details
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
