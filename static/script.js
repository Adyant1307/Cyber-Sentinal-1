async function fetchLiveThreats() {
  const container = document.getElementById("news-container")
  if (!container) return

  container.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>'

  try {
    const res = await fetch("/api/live")
    const data = await res.json()

    if (data.length === 0) {
      container.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">📰</div>
          <div class="no-results-text">No news available at the moment</div>
        </div>
      `
      return
    }

    container.innerHTML = ""

    // News image categories
    const newsImages = {
      ransomware:
        "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      malware:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      hack: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      breach:
        "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      vulnerability:
        "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      default:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    }

    data.forEach((entry, index) => {
      const isThreat = entry.status === "Threat"
      const threatClass = isThreat ? "threat-high" : "threat-low"
      const threatBadge = isThreat
        ? '<span class="badge badge-danger">Threat</span>'
        : '<span class="badge badge-success">Safe</span>'

      // Extract source from the post (format: [SOURCE] Title)
      let source = "News Source"
      let title = entry.post

      if (entry.post.startsWith("[") && entry.post.includes("]")) {
        const closeBracketIndex = entry.post.indexOf("]")
        source = entry.post.substring(1, closeBracketIndex)
        title = entry.post.substring(closeBracketIndex + 1).trim()
      }

      // Determine category tags based on content
      const tags = []
      let imageUrl = newsImages.default

      if (title.toLowerCase().includes("ransomware")) {
        tags.push('<span class="badge badge-danger">Ransomware</span>')
        imageUrl = newsImages.ransomware
      }
      if (title.toLowerCase().includes("malware")) {
        tags.push('<span class="badge badge-warning">Malware</span>')
        imageUrl = newsImages.malware
      }
      if (title.toLowerCase().includes("hack")) {
        tags.push('<span class="badge badge-warning">Hack</span>')
        imageUrl = newsImages.hack
      }
      if (title.toLowerCase().includes("breach")) {
        tags.push('<span class="badge badge-danger">Breach</span>')
        imageUrl = newsImages.breach
      }
      if (title.toLowerCase().includes("vulnerability")) {
        tags.push('<span class="badge badge-warning">Vulnerability</span>')
        imageUrl = newsImages.vulnerability
      }
      if (title.toLowerCase().includes("patch")) {
        tags.push('<span class="badge badge-success">Patch</span>')
      }
      if (tags.length === 0) {
        tags.push('<span class="badge badge-secondary">News</span>')
      }

      const card = document.createElement("div")
      card.className = `news-card ${threatClass} fade-in`
      card.style.animationDelay = `${index * 0.1}s`

      card.innerHTML = `
        <img src="${imageUrl}" alt="${title}" class="news-img">
        <div class="news-content">
          <div class="news-source">${source}</div>
          <h3 class="news-title">${title}</h3>
          <div class="news-tags">
            ${threatBadge}
            ${tags.join("")}
          </div>
          <div class="news-meta">
            <span>${new Date().toLocaleDateString()}</span>
            <a href="#" class="read-more">Read more</a>
          </div>
        </div>
      `

      // Add click event to open article
      card.addEventListener("click", () => {
        // In a real implementation, this would open the full article
        alert(`This would open the full article: ${title}`)
      })

      container.appendChild(card)
    })

    // Update summary count
    const threatCount = data.filter((item) => item.status === "Threat").length
    document.getElementById("threat-count").textContent = threatCount
  } catch (error) {
    console.error("Error fetching live threats:", error)
    container.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">⚠️</div>
        <div class="no-results-text">Failed to load news. Please try again.</div>
      </div>
    `
  }
}

async function fetchDarkwebRaw() {
  const res = await fetch("/api/darkweb/raw")
  const data = await res.json()
  const ul = document.querySelector("#darkweb-raw")
  ul.innerHTML = ""
  data.forEach((post) => {
    ul.innerHTML += `<li>${post}</li>`
  })
}

async function fetchDarkwebThreats() {
  const container = document.getElementById("darkweb-container")
  if (!container) return

  container.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>'

  try {
    const res = await fetch("/api/darkweb")
    const data = await res.json()

    if (data.length === 0) {
      container.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <div class="no-results-text">No dark web threats detected</div>
        </div>
      `
      return
    }

    container.innerHTML = ""

    data.forEach((entry, index) => {
      const isThreat = entry.status === "Threat"
      let threatClass = "threat-low"

      if (isThreat) {
        if (entry.threat_level === "High") threatClass = "threat-high"
        else if (entry.threat_level === "Medium") threatClass = "threat-medium"
      }

      const card = document.createElement("div")
      card.className = `darkweb-card ${threatClass} fade-in`
      card.style.animationDelay = `${index * 0.1}s`

      let threatBadge = '<span class="badge badge-success">Safe</span>'
      if (isThreat) {
        if (entry.threat_level === "High") {
          threatBadge = '<span class="badge badge-danger">High Threat</span>'
        } else if (entry.threat_level === "Medium") {
          threatBadge = '<span class="badge badge-warning">Medium Threat</span>'
        } else {
          threatBadge = '<span class="badge badge-primary">Low Threat</span>'
        }
      }

      card.innerHTML = `
        <div class="darkweb-content">${entry.post}</div>
        <div class="darkweb-meta">
          <div>
            ${threatBadge}
          </div>
          <div>${entry.time}</div>
        </div>
      `

      container.appendChild(card)
    })

    // Update summary count
    const darkwebThreatCount = data.filter((item) => item.status === "Threat").length
    document.getElementById("darkweb-count").textContent = darkwebThreatCount
  } catch (error) {
    console.error("Error fetching darkweb threats:", error)
    container.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">⚠️</div>
        <div class="no-results-text">Failed to load dark web threats. Please try again.</div>
      </div>
    `
  }
}

function checkCredentials() {
  const input = document.getElementById("hibp-input").value.trim()
  const resultsContainer = document.getElementById("breach-results")

  if (!resultsContainer) return

  if (!input) {
    resultsContainer.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <div class="no-results-text">Please enter an email, username, or phone number</div>
      </div>
    `
    return
  }

  resultsContainer.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>'

  fetch(`/api/hibp-check?query=${encodeURIComponent(input)}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        resultsContainer.innerHTML = `
          <div class="no-results">
            <div class="no-results-icon">⚠️</div>
            <div class="no-results-text">${data.error}</div>
          </div>
        `
      } else if (data.length === 0) {
        resultsContainer.innerHTML = `
          <div class="no-results">
            <div class="no-results-icon">✅</div>
            <div class="no-results-text">Good news! No breaches found for "${input}"</div>
          </div>
        `
        // Update summary count
        document.getElementById("breach-count").textContent = "0"
      } else {
        resultsContainer.innerHTML = ""

        // HIBP breach data
        const breachLogos = {
          Adobe: "https://haveibeenpwned.com/Content/Images/PwnedLogos/Adobe.png",
          LinkedIn: "https://haveibeenpwned.com/Content/Images/PwnedLogos/LinkedIn.png",
          Dropbox: "https://haveibeenpwned.com/Content/Images/PwnedLogos/Dropbox.png",
          MySpace: "https://haveibeenpwned.com/Content/Images/PwnedLogos/MySpace.png",
          default: "https://haveibeenpwned.com/Content/Images/PwnedLogos/Generic.png",
        }

        data.forEach((entry, index) => {
          // Determine severity based on password presence
          let severity = "Low"
          let severityClass = "threat-low"

          if (entry.password && entry.password.length > 0) {
            severity = "High"
            severityClass = "threat-high"
          }

          // Extract breach name (before the colon)
          let breachName = entry.leak
          if (breachName.includes(":")) {
            breachName = breachName.split(":")[0].trim()
          }

          // Get logo or use default
          const logoUrl = breachLogos[breachName] || breachLogos.default

          const card = document.createElement("div")
          card.className = `breach-card ${severityClass} fade-in`
          card.style.animationDelay = `${index * 0.1}s`

          const severityBadge =
            severity === "High"
              ? '<span class="badge badge-danger">High Severity</span>'
              : '<span class="badge badge-warning">Low Severity</span>'

          const breachDate = new Date().toLocaleDateString()

          card.innerHTML = `
            <div class="breach-header">
              <div>
                <h3 class="breach-title">${breachName}</h3>
                <div class="breach-meta">Breach detected for: ${input}</div>
              </div>
              <button class="copy-btn" title="Copy details" onclick="copyToClipboard('${entry.leak}: ${entry.password}')">
                <i class="fas fa-copy"></i>
              </button>
            </div>
            <div class="breach-content">
              <p><strong>Compromised data:</strong> Email, ${entry.password ? "Password" : "Username"}, Personal Info</p>
              <p><strong>Password exposed:</strong> ${entry.password ? "Yes (hidden for security)" : "No"}</p>
              <p><strong>Breach date:</strong> ${breachDate}</p>
              <p>This breach may include personal information associated with your account.</p>
            </div>
            <div class="breach-footer">
              <div>
                ${severityBadge}
              </div>
              <div class="breach-meta">
                <a href="https://haveibeenpwned.com/API/v2" target="_blank">HIBP API</a>
              </div>
            </div>
          `

          resultsContainer.appendChild(card)
        })

        // Update summary count
        document.getElementById("breach-count").textContent = data.length
      }
    })
    .catch((err) => {
      console.error("Error checking credentials:", err)
      resultsContainer.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">⚠️</div>
          <div class="no-results-text">Failed to check credentials. Please try again.</div>
        </div>
      `
    })
}

// Fetch cybersecurity companies news
function fetchCompaniesNews() {
  const container = document.getElementById("companies-container")
  if (!container) return

  container.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>'

  // Sample company data (in a real app, this would come from an API)
  const companies = [
    {
      name: "CrowdStrike",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/CrowdStrike_logo.svg/1200px-CrowdStrike_logo.svg.png",
      description:
        "CrowdStrike announced a new threat hunting service that uses AI to proactively identify potential breaches before they occur.",
      update: "New AI-powered threat hunting service launched",
      date: "2023-05-15",
    },
    {
      name: "Palo Alto Networks",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Palo_Alto_Networks_logo.svg/1200px-Palo_Alto_Networks_logo.svg.png",
      description:
        "Palo Alto Networks has acquired cloud security startup Bridgecrew to enhance its Prisma Cloud platform with infrastructure-as-code security.",
      update: "Acquisition of Bridgecrew completed",
      date: "2023-04-22",
    },
    {
      name: "Fortinet",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Fortinet_logo.svg/1200px-Fortinet_logo.svg.png",
      description:
        "Fortinet released FortiOS 7.2 with enhanced ZTNA capabilities and improved SD-WAN performance for remote workers.",
      update: "FortiOS 7.2 released with ZTNA enhancements",
      date: "2023-06-01",
    },
    {
      name: "Cisco",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/1200px-Cisco_logo_blue_2016.svg.png",
      description:
        "Cisco has patched a critical vulnerability in its IOS XE software that could allow remote code execution with root privileges.",
      update: "Critical IOS XE vulnerability patched",
      date: "2023-05-10",
    },
  ]

  container.innerHTML = ""

  companies.forEach((company, index) => {
    const card = document.createElement("div")
    card.className = "company-card fade-in"
    card.style.animationDelay = `${index * 0.1}s`

    card.innerHTML = `
      <img src="${company.logo}" alt="${company.name} logo" class="company-logo">
      <div class="company-content">
        <h3 class="company-name">${company.name}</h3>
        <p class="company-description">${company.description}</p>
        <div class="company-meta">
          <span><strong>Latest update:</strong> ${company.update}</span>
          <span>${company.date}</span>
        </div>
      </div>
    `

    container.appendChild(card)
  })
}

// Fetch certification updates
function fetchCertificationUpdates() {
  const container = document.getElementById("certifications-container")
  if (!container) return

  container.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>'

  // Sample certification data (in a real app, this would come from an API)
  const certifications = [
    {
      name: "CompTIA Security+",
      provider: "CompTIA",
      image: "https://comptiacdn.azureedge.net/webcontent/images/default-source/siteicons/logosecurity.svg",
      description:
        "CompTIA has updated the Security+ (SY0-601) exam with new objectives covering cloud security and IoT security threats.",
      date: "2023-05-20",
      type: "Update",
    },
    {
      name: "CISSP",
      provider: "ISC²",
      image: "https://www.isc2.org/-/media/ISC2/Landing-Pages/CISSP-Landing/cissp-logo.ashx",
      description:
        "ISC² has announced changes to the CISSP certification with a greater focus on zero trust architecture and cloud security models.",
      date: "2023-04-15",
      type: "Revision",
    },
    {
      name: "CCNA",
      provider: "Cisco",
      image: "https://www.cisco.com/c/dam/assets/swa/img/anchor-info/ccna-logo-295x144.png",
      description:
        "Cisco has updated the CCNA curriculum to include more content on network automation and programmability.",
      date: "2023-06-05",
      type: "Update",
    },
    {
      name: "CEH",
      provider: "EC-Council",
      image: "https://www.eccouncil.org/wp-content/uploads/2021/08/CEH-logo.svg",
      description:
        "EC-Council has released CEH v12 with expanded coverage of container security, cloud security, and AI-based attacks.",
      date: "2023-03-30",
      type: "New Version",
    },
  ]

  container.innerHTML = ""

  certifications.forEach((cert, index) => {
    const card = document.createElement("div")
    card.className = "certification-card fade-in"
    card.style.animationDelay = `${index * 0.1}s`

    card.innerHTML = `
      <img src="${cert.image}" alt="${cert.name} logo" class="certification-img">
      <div class="certification-content">
        <div class="certification-provider">${cert.provider}</div>
        <h3 class="certification-name">${cert.name}</h3>
        <p class="certification-description">${cert.description}</p>
        <div class="certification-meta">
          <span class="certification-date">${cert.date}</span>
          <span class="badge badge-primary">${cert.type}</span>
        </div>
      </div>
    `

    container.appendChild(card)
  })
}

// Copy to clipboard functionality
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Copied to clipboard!")
    })
    .catch((err) => {
      console.error("Failed to copy: ", err)
    })
}

// Update last refresh time
function updateLastRefreshTime() {
  const timeElement = document.getElementById("last-refresh")
  if (timeElement) {
    const now = new Date()
    timeElement.textContent = now.toLocaleTimeString()
  }
}

// Refresh all data
function refreshAll() {
  fetchLiveThreats()
  fetchDarkwebThreats()
  fetchCompaniesNews()
  fetchCertificationUpdates()
  updateLastRefreshTime()
}

// Initialize dashboard
function initDashboard() {
  // Set up event listeners
  const searchForm = document.getElementById("search-form")
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault()
      checkCredentials()
    })
  }

  const autoRefreshToggle = document.getElementById("auto-refresh-toggle")
  if (autoRefreshToggle) {
    autoRefreshToggle.addEventListener("change", toggleAutoRefresh)
  }

  // Set up keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + / for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === "/") {
      e.preventDefault()
      const searchInput = document.getElementById("hibp-input")
      if (searchInput) searchInput.focus()
    }

    // Ctrl/Cmd + R for refresh
    if ((e.ctrlKey || e.metaKey) && e.key === "r") {
      e.preventDefault()
      refreshAll()
    }
  })

  // Set up tabs
  const tabButtons = document.querySelectorAll(".tab-btn")
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.getAttribute("data-tab")

      // Remove active class from all buttons and content
      document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))
      document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"))

      // Add active class to clicked button and corresponding content
      button.classList.add("active")
      document.getElementById(tabId).classList.add("active")
    })
  })

  // Initial data load
  refreshAll()
}

// Matrix background effect
function initMatrix() {
  const canvas = document.getElementById("matrix-canvas")
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const chars = "01010101010101"
  const fontSize = 14
  const columns = canvas.width / fontSize
  const drops = []

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

  setInterval(draw, 33)

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
}

// Theme toggle
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle")
  if (!themeToggle) return

  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)")
  const currentTheme = localStorage.getItem("theme")

  if (currentTheme === "light") {
    document.body.classList.add("light-mode")
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
  } else {
    document.body.classList.remove("light-mode")
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
  }

  themeToggle.addEventListener("click", () => {
    if (document.body.classList.contains("light-mode")) {
      document.body.classList.remove("light-mode")
      localStorage.setItem("theme", "dark")
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
    } else {
      document.body.classList.add("light-mode")
      localStorage.setItem("theme", "light")
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
    }
  })
}

// Dashboard functionality
let autoRefreshInterval
let isAutoRefreshEnabled = false

function toggleAutoRefresh() {
  const toggle = document.getElementById("auto-refresh-toggle")
  if (!toggle) return

  isAutoRefreshEnabled = toggle.checked

  if (isAutoRefreshEnabled) {
    autoRefreshInterval = setInterval(refreshAll, 120000) // 2 minutes
    document.getElementById("auto-refresh-status").textContent = "Auto-refresh: ON"
  } else {
    clearInterval(autoRefreshInterval)
    document.getElementById("auto-refresh-status").textContent = "Auto-refresh: OFF"
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initMatrix()
  initThemeToggle()

  // Check if we're on the dashboard page
  if (document.body.classList.contains("dashboard-page")) {
    initDashboard()
  }

  // Initialize featured news on home page
  const featuredNewsContainer = document.getElementById("featured-news-grid")
  if (featuredNewsContainer) {
    fetchFeaturedNews()
  }
})

// Fetch featured news for the home page
function fetchFeaturedNews() {
  const container = document.getElementById("featured-news-grid")
  if (!container) return

  container.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>'

  // In a real app, this would fetch from an API
  fetch("/api/live")
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        container.innerHTML = `
          <div class="no-results">
            <div class="no-results-icon">📰</div>
            <div class="no-results-text">No featured news available</div>
          </div>
        `
        return
      }

      container.innerHTML = ""

      // News image categories
      const newsImages = {
        ransomware:
          "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
        malware:
          "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
        hack: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
        breach:
          "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
        vulnerability:
          "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
        default:
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      }

      // Display only the first 3 news items
      const featuredNews = data.slice(0, 3)

      featuredNews.forEach((entry, index) => {
        // Extract source from the post (format: [SOURCE] Title)
        let source = "News Source"
        let title = entry.post

        if (entry.post.startsWith("[") && entry.post.includes("]")) {
          const closeBracketIndex = entry.post.indexOf("]")
          source = entry.post.substring(1, closeBracketIndex)
          title = entry.post.substring(closeBracketIndex + 1).trim()
        }

        // Determine image based on content
        let imageUrl = newsImages.default
        if (title.toLowerCase().includes("ransomware")) imageUrl = newsImages.ransomware
        if (title.toLowerCase().includes("malware")) imageUrl = newsImages.malware
        if (title.toLowerCase().includes("hack")) imageUrl = newsImages.hack
        if (title.toLowerCase().includes("breach")) imageUrl = newsImages.breach
        if (title.toLowerCase().includes("vulnerability")) imageUrl = newsImages.vulnerability

        const card = document.createElement("div")
        card.className = "featured-news-card fade-in"
        card.style.animationDelay = `${index * 0.1}s`

        card.innerHTML = `
          <img src="${imageUrl}" alt="${title}" class="featured-news-img">
          <div class="featured-news-content">
            <div class="featured-news-source">${source}</div>
            <h3 class="featured-news-title">${title}</h3>
            <p class="featured-news-excerpt">
              ${title.length > 50 ? title : "Latest cybersecurity news and updates from trusted sources. Stay informed about the latest threats and vulnerabilities."}
            </p>
            <div class="featured-news-footer">
              <span class="featured-news-date">${new Date().toLocaleDateString()}</span>
              <a href="/dashboard" class="featured-news-link">Read more</a>
            </div>
          </div>
        `

        container.appendChild(card)
      })
    })
    .catch((error) => {
      console.error("Error fetching featured news:", error)
      container.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">⚠️</div>
          <div class="no-results-text">Failed to load featured news. Please try again.</div>
        </div>
      `
    })
}

// Global stats for dashboard
function updateGlobalStats() {
  // In a real app, this would fetch from an API
  const stats = {
    activeThreats: Math.floor(Math.random() * 1000) + 500,
    breachedAccounts: Math.floor(Math.random() * 10000000) + 5000000,
    vulnerabilities: Math.floor(Math.random() * 5000) + 1000,
    attacksBlocked: Math.floor(Math.random() * 1000000) + 500000,
  }

  document.getElementById("active-threats").textContent = stats.activeThreats.toLocaleString()
  document.getElementById("breached-accounts").textContent = stats.breachedAccounts.toLocaleString()
  document.getElementById("vulnerabilities").textContent = stats.vulnerabilities.toLocaleString()
  document.getElementById("attacks-blocked").textContent = stats.attacksBlocked.toLocaleString()
}
