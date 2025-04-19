import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface CertificationCardProps {
  certification: {
    name: string
    provider: string
    image: string
    description: string
    date: string
    type: string
    url?: string
  }
}

export function CertificationCard({ certification }: CertificationCardProps) {
  return (
    <Card className="overflow-hidden border-border/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg neon-card h-full">
      <div className="flex h-24 items-center justify-center bg-white p-2">
        <img
          src={certification.image || "/placeholder.svg"}
          alt={`${certification.name} logo`}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <CardContent className="p-3">
        <div className="mb-1 text-xs font-medium text-blue-400 neon-text">{certification.provider}</div>
        <h3 className="mb-1 text-sm font-bold">{certification.name}</h3>
        <p className="mb-2 text-xs text-muted-foreground line-clamp-2">{certification.description}</p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {certification.type}
          </Badge>
          <a
            href={
              certification.url ||
              `https://www.google.com/search?q=${encodeURIComponent(certification.name + " " + certification.provider)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 neon-text"
          >
            Read more
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
