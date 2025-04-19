"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Shield, RefreshCw, ChevronRight, AlertTriangle, Globe, BookOpen, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { NewsCard } from "@/components/news-card"
import { DarkwebCard } from "@/components/darkweb-card"
import { CompanyCard } from "@/components/company-card"
import { CertificationCard } from "@/components/certification-card"

export default function NewsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<string>("-")
  const [newsData, setNewsData] = useState<any[]>([])
  const [darkwebData, setDarkwebData] = useState<any[]>([])
  const [companyData, setCompanyData] = useState<any[]>([])
  const [certificationData, setCertificationData] = useState<any[]>([])

  // Fetch all data
  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      const [news, darkweb, companies, certifications] = await Promise.all([
        fetchLiveThreats(),
        fetchDarkwebThreats(),
        fetchCompaniesNews(),
        fetchCertificationUpdates(),
      ])

      setNewsData(news.length > 0 ? news : generateMockNews())
      setDarkwebData(darkweb.length > 0 ? darkweb : generateMockDarkweb())
      setCompanyData(companies)
      setCertificationData(certifications)

      updateLastRefreshTime()
    } catch (error) {
      console.error("Error fetching data:", error)
      setNewsData(generateMockNews())
      setDarkwebData(generateMockDarkweb())
    } finally {
      setIsLoading(false)
    }
  }

  // Generate mock news if API fails
  const generateMockNews = () => {
    return [
      {
        post: "[THN] Critical Zero-Day Vulnerability Found in Popular Web Browsers",
        status: "Threat",
      },
      {
        post: "[BC] Ransomware Group Claims Responsibility for Major Bank Data Breach",
        status: "Threat",
      },
      {
        post: "[SW] New Phishing Campaign Targets Remote Workers with Fake Meeting Links",
        status: "Threat",
      },
      {
        post: "[THN] Microsoft Releases Emergency Patch for Windows Vulnerability",
        status: "Safe",
      },
      {
        post: "[BC] Security Researchers Discover New Method to Detect Malware",
        status: "Safe",
      },
      {
        post: "[SW] Government Issues Advisory on Critical Infrastructure Protection",
        status: "Threat",
      },
    ]
  }

  // Generate mock darkweb data if API fails
  const generateMockDarkweb = () => {
    return [
      {
        post: "Selling credentials from breached enterprise in Asia",
        status: "Threat",
        threat_level: "High",
        time: new Date().toLocaleTimeString(),
      },
      {
        post: "Database dump listed on hidden forum: includes PII",
        status: "Threat",
        threat_level: "Medium",
        time: new Date().toLocaleTimeString(),
      },
      {
        post: "Zero-day exploit for popular CMS being traded",
        status: "Threat",
        threat_level: "High",
        time: new Date().toLocaleTimeString(),
      },
      {
        post: "New botnet infrastructure established for DDoS attacks",
        status: "Threat",
        threat_level: "Medium",
        time: new Date().toLocaleTimeString(),
      },
      {
        post: "Credit card skimming operation targeting e-commerce sites",
        status: "Threat",
        threat_level: "High",
        time: new Date().toLocaleTimeString(),
      },
      {
        post: "Leaked source code being analyzed for vulnerabilities",
        status: "Threat",
        threat_level: "Low",
        time: new Date().toLocaleTimeString(),
      },
    ]
  }

  // Update last refresh time
  const updateLastRefreshTime = () => {
    const now = new Date()
    setLastRefresh(now.toLocaleTimeString())
  }

  // Fetch live threats
  const fetchLiveThreats = async () => {
    try {
      const res = await fetch("/api/live")
      const data = await res.json()
      return data
    } catch (error) {
      console.error("Error fetching live threats:", error)
      return []
    }
  }

  // Fetch darkweb threats
  const fetchDarkwebThreats = async () => {
    try {
      const res = await fetch("/api/darkweb")
      const data = await res.json()
      return data
    } catch (error) {
      console.error("Error fetching darkweb threats:", error)
      return []
    }
  }

  // Fetch companies news (mock data for now)
  const fetchCompaniesNews = async () => {
    // This would be replaced with actual API call in production
    return [
      {
        name: "CrowdStrike",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/CrowdStrike_logo.svg/1200px-CrowdStrike_logo.svg.png",
        description:
          "CrowdStrike announced a new threat hunting service that uses AI to proactively identify potential breaches before they occur.",
        update: "New AI-powered threat hunting service launched",
        date: "2023-05-15",
        url: "https://www.crowdstrike.com/blog/",
      },
      {
        name: "Palo Alto Networks",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Palo_Alto_Networks_logo.svg/1200px-Palo_Alto_Networks_logo.svg.png",
        description:
          "Palo Alto Networks has acquired cloud security startup Bridgecrew to enhance its Prisma Cloud platform with infrastructure-as-code security.",
        update: "Acquisition of Bridgecrew completed",
        date: "2023-04-22",
        url: "https://www.paloaltonetworks.com/blog",
      },
      {
        name: "Fortinet",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Fortinet_logo.svg/1200px-Fortinet_logo.svg.png",
        description:
          "Fortinet released FortiOS 7.2 with enhanced ZTNA capabilities and improved SD-WAN performance for remote workers.",
        update: "FortiOS 7.2 released with ZTNA enhancements",
        date: "2023-06-01",
        url: "https://www.fortinet.com/blog",
      },
      {
        name: "Cisco",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/1200px-Cisco_logo_blue_2016.svg.png",
        description:
          "Cisco has patched a critical vulnerability in its IOS XE software that could allow remote code execution with root privileges.",
        update: "Critical IOS XE vulnerability patched",
        date: "2023-05-10",
        url: "https://www.cisco.com/c/en/us/products/security/",
      },
      {
        name: "SentinelOne",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Sentinel_One_logo.svg/1200px-Sentinel_One_logo.svg.png",
        description:
          "SentinelOne has expanded its XDR platform with new threat hunting capabilities and improved cloud workload protection.",
        update: "XDR platform expansion",
        date: "2023-06-05",
        url: "https://www.sentinelone.com/blog/",
      },
      {
        name: "Microsoft Security",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png",
        description:
          "Microsoft has integrated its Defender for Cloud with Google Cloud Platform, extending its multi-cloud security capabilities.",
        update: "GCP integration for Defender for Cloud",
        date: "2023-05-25",
        url: "https://www.microsoft.com/en-us/security/",
      },
    ]
  }

  // Fetch certification updates (mock data for now)
  const fetchCertificationUpdates = async () => {
    // This would be replaced with actual API call in production
    return [
      {
        name: "CompTIA Security+",
        provider: "CompTIA",
        image: "https://comptiacdn.azureedge.net/webcontent/images/default-source/siteicons/logosecurity.svg",
        description:
          "CompTIA has updated the Security+ (SY0-601) exam with new objectives covering cloud security and IoT security threats.",
        date: "2023-05-20",
        type: "Update",
        url: "https://www.comptia.org/certifications/security",
      },
      {
        name: "CISSP",
        provider: "ISC²",
        image: "https://www.isc2.org/-/media/ISC2/Landing-Pages/CISSP-Landing/cissp-logo.ashx",
        description:
          "ISC² has announced changes to the CISSP certification with a greater focus on zero trust architecture and cloud security models.",
        date: "2023-04-15",
        type: "Revision",
        url: "https://www.isc2.org/Certifications/CISSP",
      },
      {
        name: "CCNA",
        provider: "Cisco",
        image: "https://www.cisco.com/c/dam/assets/swa/img/anchor-info/ccna-logo-295x144.png",
        description:
          "Cisco has updated the CCNA curriculum to include more content on network automation and programmability.",
        date: "2023-06-05",
        type: "Update",
        url: "https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html",
      },
      {
        name: "CEH",
        provider: "EC-Council",
        image: "https://www.eccouncil.org/wp-content/uploads/2021/08/CEH-logo.svg",
        description:
          "EC-Council has released CEH v12 with expanded coverage of container security, cloud security, and AI-based attacks.",
        date: "2023-03-30",
        type: "New Version",
        url: "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/",
      },
      {
        name: "AWS Certified Security",
        provider: "Amazon Web Services",
        image:
          "https://d1.awsstatic.com/training-and-certification/certification-badges/AWS-Certified-Security-Specialty_badge.634f8a21af2e0e956ed8905a72366146ba22b74c.png",
        description:
          "AWS has updated its Security Specialty certification to include more focus on container security and serverless security models.",
        date: "2023-04-10",
        type: "Update",
        url: "https://aws.amazon.com/certification/certified-security-specialty/",
      },
      {
        name: "CISM",
        provider: "ISACA",
        image: "https://www.isaca.org/-/media/images/isacadp/project/isaca/icons/certification-cism-icon.png",
        description:
          "ISACA has revised the CISM certification to include more content on security governance and risk management in digital transformation.",
        date: "2023-05-15",
        type: "Revision",
        url: "https://www.isaca.org/credentialing/cism",
      },
    ]
  }

  // Initialize page
  useEffect(() => {
    fetchAllData()
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
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
                className="text-xs font-medium text-foreground/80 transition-colors hover:text-blue-400"
              >
                Dashboard
              </Link>
              <Link
                href="/news"
                className="text-xs font-medium text-blue-400 transition-colors hover:text-blue-300 neon-text"
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
              <h1 className="text-2xl font-bold text-blue-400 neon-text">Cybersecurity News & Updates</h1>
              <p className="text-xs text-muted-foreground">
                Stay informed with the latest cybersecurity news, dark web threats, company updates, and certification
                changes.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAllData}
              className="gap-2 neon-card border-blue-400/30 text-blue-400"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh All
            </Button>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Last updated: <span className="font-medium">{lastRefresh}</span>
            </p>
          </div>

          {/* News sections */}
          <div className="space-y-6">
            {/* Live Cybersecurity News */}
            <section>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm neon-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-blue-400" />
                    <CardTitle className="text-lg text-blue-400 neon-text">Live Cybersecurity News</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs text-blue-400">
                    See All <ChevronRight className="h-3 w-3" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-400 border-t-transparent"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {newsData.slice(0, 6).map((news, index) => (
                        <NewsCard key={index} news={news} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Dark Web Threat Detection */}
            <section>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm neon-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-400" />
                    <CardTitle className="text-lg text-blue-400 neon-text">Dark Web Threat Detection</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs text-blue-400">
                    See All <ChevronRight className="h-3 w-3" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-400 border-t-transparent"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {darkwebData.slice(0, 6).map((threat, index) => (
                        <DarkwebCard key={index} threat={threat} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Cybersecurity Companies and Updates */}
            <section>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm neon-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                    <CardTitle className="text-lg text-blue-400 neon-text">
                      Cybersecurity Companies and Updates
                    </CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs text-blue-400">
                    See All <ChevronRight className="h-3 w-3" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-400 border-t-transparent"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {companyData.slice(0, 6).map((company, index) => (
                        <CompanyCard key={index} company={company} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Cybersecurity & Networking Certification Updates */}
            <section>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm neon-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-400" />
                    <CardTitle className="text-lg text-blue-400 neon-text">
                      Cybersecurity & Networking Certification Updates
                    </CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs text-blue-400">
                    See All <ChevronRight className="h-3 w-3" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-400 border-t-transparent"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {certificationData.slice(0, 6).map((cert, index) => (
                        <CertificationCard key={index} certification={cert} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}
