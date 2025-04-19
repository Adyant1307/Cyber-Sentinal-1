import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface CompanyCardProps {
  company: {
    name: string
    logo: string
    description: string
    update: string
    date: string
    url?: string
  }
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card className="overflow-hidden border-border/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg neon-card h-full">
      <div className="flex h-24 items-center justify-center bg-white p-2">
        <img
          src={company.logo || "/placeholder.svg"}
          alt={`${company.name} logo`}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <CardContent className="p-3">
        <h3 className="mb-1 text-sm font-bold">{company.name}</h3>
        <p className="mb-2 text-xs text-muted-foreground line-clamp-2">{company.description}</p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {company.update}
          </Badge>
          <a
            href={company.url || `https://www.google.com/search?q=${encodeURIComponent(company.name)}`}
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
