import { cn } from "@/lib/utils"

interface ThreatMeterProps {
  value: number
  maxValue: number
  className?: string
}

export function ThreatMeter({ value, maxValue, className }: ThreatMeterProps) {
  const percentage = Math.min(100, (value / maxValue) * 100)

  // Determine color based on percentage
  const getColor = () => {
    if (percentage <= 30) return "bg-green-500"
    if (percentage <= 70) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div className={cn("h-full transition-all duration-500", getColor())} style={{ width: `${percentage}%` }} />
    </div>
  )
}
