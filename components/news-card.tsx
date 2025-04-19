import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface NewsCardProps {
  news: {
    post: string
    status: string
  }
}

export function NewsCard({ news }: NewsCardProps) {
  const isThreat = news.status === "Threat"

  // Extract source from the post (format: [SOURCE] Title)
  let source = "News Source"
  let title = news.post

  if (news.post.startsWith("[") && news.post.includes("]")) {
    const closeBracketIndex = news.post.indexOf("]")
    source = news.post.substring(1, closeBracketIndex)
    title = news.post.substring(closeBracketIndex + 1).trim()
  }

  // Determine category tags based on content
  const tags = []
  let imageUrl =
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"

  if (title.toLowerCase().includes("ransomware")) {
    tags.push("Ransomware")
    imageUrl =
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  } else if (title.toLowerCase().includes("malware")) {
    tags.push("Malware")
    imageUrl =
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  } else if (title.toLowerCase().includes("hack")) {
    tags.push("Hack")
    imageUrl =
      "https://images.unsplash.com/photo-1563206767-5b18f218e8de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  } else if (title.toLowerCase().includes("breach")) {
    tags.push("Breach")
    imageUrl =
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  } else if (title.toLowerCase().includes("vulnerability") || title.toLowerCase().includes("zero-day")) {
    tags.push("Vulnerability")
    imageUrl =
      "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  } else if (title.toLowerCase().includes("phishing")) {
    tags.push("Phishing")
    imageUrl =
      "https://images.unsplash.com/photo-1566738780863-f9608f88f3a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  } else if (title.toLowerCase().includes("patch") || title.toLowerCase().includes("update")) {
    tags.push("Patch")
    imageUrl =
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  } else if (title.toLowerCase().includes("microsoft")) {
    tags.push("Microsoft")
    imageUrl =
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  } else if (title.toLowerCase().includes("cloud")) {
    tags.push("Cloud")
    imageUrl =
      "https://images.unsplash.com/photo-1603695576504-b2b22b530a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  } else if (title.toLowerCase().includes("security")) {
    tags.push("Security")
    imageUrl =
      "https://images.unsplash.com/photo-1614064642639-e398cf05badb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  } else {
    tags.push("News")
  }

  // Generate a URL based on the source
  const getArticleUrl = () => {
    if (source === "THN") return "https://thehackernews.com/"
    if (source === "BC") return "https://www.bleepingcomputer.com/news/security/"
    if (source === "SW") return "https://www.securityweek.com/"
    return "https://www.google.com/search?q=" + encodeURIComponent(title)
  }

  return (
    <Card className="group overflow-hidden border-border/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg neon-card h-full">
      <div className="relative h-32 overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-2 left-2">
          <Badge variant={isThreat ? "destructive" : "secondary"} className="text-xs">
            {isThreat ? "Threat" : "Safe"}
          </Badge>
        </div>
      </div>
      <CardContent className="p-3">
        <div className="mb-1 text-xs font-medium text-blue-400 neon-text">{source}</div>
        <h3 className="mb-1 line-clamp-2 text-sm font-bold">{title}</h3>
        <div className="mb-2 flex flex-wrap gap-1">
          {tags.map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{new Date().toLocaleDateString()}</span>
          <a
            href={getArticleUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 transition-colors hover:text-blue-300 neon-text"
          >
            Read more
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
