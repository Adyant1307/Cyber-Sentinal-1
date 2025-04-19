import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface GlobalStatsCardProps {
  title: string
  value: number
  description: string
  color: string
  icon?: React.ReactNode
}

export function GlobalStatsCard({ title, value, description, color, icon }: GlobalStatsCardProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg neon-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className={cn("my-1 text-xl font-bold", color)}>{value.toLocaleString()}</p>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full", color.replace("text-", "bg-"))}
                style={{ width: `${Math.random() * 50 + 50}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
          {icon && <div className={cn("rounded-full p-3", color.replace("text-", "bg-") + "/10")}>{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
