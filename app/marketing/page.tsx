"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Play,
  Sparkles,
  Clock,
  BarChart3,
  FileText,
  Loader2,
  TrendingUp,
  Rocket,
  Link2,
  Mic,
  Send,
  MessageSquare,
  Mail,
  BookOpen,
  Video,
  Image as ImageIcon,
  Menu,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Platform configurations with grouping
const platformGroups = [
  {
    group: "Social",
    platforms: [
      { id: "x", name: "X", icon: MessageSquare },
      { id: "threads", name: "Threads", icon: MessageSquare },
      { id: "bluesky", name: "Bluesky", icon: MessageSquare },
    ],
  },
  {
    group: "Content",
    platforms: [
      { id: "blog", name: "Blog", icon: BookOpen },
      { id: "newsletter", name: "Newsletter", icon: Mail },
    ],
  },
  {
    group: "Visual",
    platforms: [
      { id: "instagram", name: "Instagram", icon: ImageIcon },
      { id: "tiktok", name: "TikTok Video Scripts", icon: Video },
    ],
  },
]

// Sample posts for each platform
const samplePosts: Record<string, string[]> = {
  x: [
    "🚀 Just discovered the secret to faster growth. Simpler than you think.",
    "3 mistakes everyone makes. Here's what I learned after 1000 posts.",
  ],
  threads: [
    "Thread 1: The biggest misconception about content creation? It's not about posting more—it's about posting smarter.",
    "Thread 2: Here's what changed when I stopped guessing and started analyzing.",
  ],
  bluesky: [
    "Why I switched from manual posting to AI-powered content. The results speak for themselves.",
  ],
  blog: [
    "The Complete Guide to Building Your Audience in 2025\n\nBuilding an audience isn't about going viral. It's about consistency, value, and genuine connection. Here's how...",
  ],
  newsletter: [
    "Why creators are switching to AI-powered content\n\nAfter analyzing 2,000+ creators, I found one pattern: the most successful ones aren't spending hours on content creation.",
  ],
  instagram: [
    "💡 Pro tip: Stop overthinking. Start posting. Consistency wins.\n\n#CreatorTips #ContentStrategy",
  ],
  tiktok: [
    "Hook: 'I used to spend 10 hours writing posts. Now I spend 10 minutes.'\n\nScript: Here's what changed when I started using AI to match my voice...",
  ],
}

// ✅ Premium Elevora Landing Page
export default function MarketingPage() {
  const [demoNiche, setDemoNiche] = useState("")
  const [demoLoading, setDemoLoading] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [generatedPosts, setGeneratedPosts] = useState<Record<string, string[]>>({})

  // Analytics tracking helper
  const trackEvent = (eventName: string, props?: Record<string, string>) => {
    if (typeof window !== "undefined" && (window as any).plausible) {
      ;(window as any).plausible(eventName, { props })
    }
    console.log(`[Analytics] ${eventName}`, props || {})
  }

  const handleDemoGenerate = async () => {
    if (!demoNiche.trim()) return
    setDemoLoading(true)
    setGeneratedPosts({})
    setSelectedPlatform(null)

    // Track demo start event
    trackEvent("demo_started", { niche: demoNiche.trim() })

    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate posts based on niche
    const posts: Record<string, string[]> = {}
    Object.keys(samplePosts).forEach((platformId) => {
      const platformPosts = samplePosts[platformId]
      posts[platformId] = platformPosts.map((post) =>
        post.replace(/\w+/g, (word) => {
          if (word.toLowerCase().includes("creator") || word.toLowerCase().includes("content")) {
            return word
          }
          return word
        })
      )
    })

    setGeneratedPosts(posts)
    setDemoLoading(false)
  }

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatform(platformId)
    trackEvent("platform_selected", { platform: platformId })
  }


  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Mouse parallax tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <main className="min-h-screen">
      {/* Unified Header + Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#111010] to-[#0a0a0a] text-white">
        {/* Background Layer - Z-index: 0 */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Multiple Golden Glows - Soft radial gradients with 5-10% opacity */}
          <motion.div
            className="absolute -top-60 left-1/2 w-[120rem] h-[120rem] -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.06)_0%,transparent_70%)] blur-3xl"
            animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
            transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
          />
          
          {/* Glow behind headline */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-[80rem] h-[80rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.05)_0%,transparent_65%)] blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut", delay: 2 }}
          />
          
          {/* Glow near mockup */}
          <motion.div
            className="absolute top-1/2 right-1/4 w-[60rem] h-[60rem] bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.08)_0%,transparent_70%)] blur-3xl"
            animate={{ x: [0, -25, 0], y: [0, 35, 0] }}
            transition={{ repeat: Infinity, duration: 22, ease: "easeInOut", delay: 1 }}
          />
          
          {/* Bottom-right glow */}
          <motion.div
            className="absolute bottom-1/4 right-1/3 w-[70rem] h-[70rem] bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.07)_0%,transparent_68%)] blur-3xl"
            animate={{ x: [0, 20, 0], y: [0, -30, 0], scale: [1, 0.95, 1] }}
            transition={{ repeat: Infinity, duration: 18, ease: "easeInOut", delay: 3 }}
          />

          {/* Floating geometric shapes */}
          <motion.div
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 5, 0],
            }}
            style={{
              x: mousePosition.x * 0.5,
              y: mousePosition.y * 0.5,
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-[8%] w-32 h-32 border border-[#FACC15]/10 rounded-full"
          />
          <motion.div
            animate={{
              y: [0, 25, 0],
              x: [0, -15, 0],
              rotate: [0, -8, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-40 right-[12%] w-24 h-24 border border-[#FACC15]/8 rounded-lg"
          />
          <motion.div
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-40 left-[15%] w-20 h-20 border border-[#FACC15]/12 rounded-full"
          />
          <motion.div
            animate={{
              y: [0, 18, 0],
              x: [0, -12, 0],
              rotate: [0, 6, 0],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute bottom-32 right-[20%] w-28 h-28 border border-[#FACC15]/10 rounded-lg"
          />

          {/* Radial Vignette - Very faint dark corners */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,10,10,0.3)_100%)] pointer-events-none" />
          
          {/* Gold haze at bottom center */}
          <motion.div
            className="absolute bottom-0 left-1/2 w-[100rem] h-[60rem] -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.04)_0%,transparent_60%)] blur-3xl"
            animate={{ opacity: [0.04, 0.06, 0.04] }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          />
        </div>

        {/* Social Icons Layer - Z-index: 1 (behind text, above background) */}
        <div className="absolute inset-0 pointer-events-none z-[1]">
          {/* Floating social platform icons - X, LinkedIn, Threads, Instagram, YouTube, TikTok */}
          {[
            { icon: MessageSquare, label: "X", pos: { top: "15%", left: "8%" }, duration: 18 },
            { icon: Link2, label: "LinkedIn", pos: { top: "35%", left: "5%" }, duration: 20 },
            { icon: MessageSquare, label: "Threads", pos: { top: "55%", left: "12%" }, duration: 22 },
            { icon: ImageIcon, label: "Instagram", pos: { top: "25%", right: "8%" }, duration: 19 },
            { icon: Video, label: "YouTube", pos: { top: "45%", right: "5%" }, duration: 21 },
            { icon: Video, label: "TikTok", pos: { top: "65%", right: "12%" }, duration: 17 },
            { icon: MessageSquare, label: "X", pos: { top: "75%", left: "25%" }, duration: 23 },
            { icon: ImageIcon, label: "Instagram", pos: { top: "85%", right: "20%" }, duration: 16 },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={`social-${i}`}
                className="absolute"
                style={item.pos}
                animate={{
                  y: [0, -10, 0],
                  x: [0, 8, 0],
                  rotate: [0, 6, 0],
                  opacity: [0.05, 0.08, 0.05],
                }}
                transition={{
                  duration: item.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.8,
                }}
              >
                <Icon className="h-7 w-7 md:h-9 md:w-9 text-[#b9a24b]" />
              </motion.div>
            )
          })}
        </div>

        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute top-0 left-0 w-full z-50"
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-8 py-6">
            {/* Logo */}
            <h1 className="text-2xl font-bold text-[#FACC15]">
              <Link href="/">Elevora</Link>
            </h1>

            {/* Navigation */}
            <nav className="hidden md:flex gap-6 text-[#d1d1d1] font-medium">
              {["Features", "Channels", "Resources", "Pricing"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="relative px-3 py-2 rounded-xl border border-transparent text-[#d1d1d1] hover:border-[#FACC15] hover:text-[#FACC15] hover:shadow-[0_0_8px_rgba(250,204,21,0.3)] active:bg-[#FACC15] active:text-black active:border-[#FACC15] transition-all duration-300 ease-in-out"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              {/* Log in */}
              <Link
                href="/sign-in"
                className="hidden sm:flex border border-gray-700 bg-black text-white px-6 py-2.5 rounded-xl shadow-[0_0_8px_rgba(0,0,0,0.3)] hover:border-[#FACC15] hover:text-[#FACC15] hover:shadow-[0_0_8px_rgba(250,204,21,0.3)] active:bg-[#FACC15] active:text-black active:border-[#FACC15] transition-all duration-300 ease-in-out"
              >
                Log in
              </Link>

              {/* Get Started */}
              <Link
                href="/sign-up"
                className="bg-[#FACC15] text-black font-semibold px-6 py-2.5 rounded-xl shadow-[0_0_10px_rgba(250,204,21,0.3)] hover:shadow-[0_0_15px_rgba(250,204,21,0.5)] hover:scale-105 active:bg-[#FACC15] active:text-black active:scale-100 transition-all duration-300 ease-in-out"
                onClick={() => trackEvent("hero_signup_click", { location: "header" })}
              >
                Get Started
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white/70 hover:text-[#FACC15] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
            >
              <div className="flex flex-col gap-4 p-6">
                {["Features", "Channels", "Resources", "Pricing"].map((item) => (
                  <Link
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm font-medium text-white/70 hover:text-[#FACC15] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
                <Link
                  href="/sign-in"
                  className="border border-gray-700 bg-black text-white px-6 py-2.5 rounded-xl hover:border-[#FACC15] hover:text-[#FACC15] hover:shadow-[0_0_8px_rgba(250,204,21,0.3)] transition-all duration-300 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
              </div>
            </motion.div>
          )}
        </motion.header>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 px-6 py-20 md:py-40 min-h-screen">
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center md:text-left space-y-8"
          >
            {/* Headline - Static */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white"
              style={{ lineHeight: "1.15" }}
            >
              Your <span className="text-[#FACC15]">AI teammate</span> for effortless, consistent, and high-performing content.
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg md:text-xl text-[#b1b1b1] max-w-2xl mx-auto md:mx-0"
              style={{ lineHeight: "1.6" }}
            >
              Elevora writes, schedules, and optimizes your posts — automatically — so you can focus on creating, not managing.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4"
            >
              <Link
                href="/sign-up"
                className="bg-[#FACC15] text-black font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 w-[90%] sm:w-auto mx-auto sm:mx-0"
                onClick={() => trackEvent("hero_signup_click", { location: "hero" })}
              >
                Start Free <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#demo"
                className="border border-gray-600 bg-black text-white px-8 py-3 rounded-xl hover:border-[#FACC15] hover:text-[#FACC15] hover:shadow-[0_0_8px_rgba(250,204,21,0.3)] active:bg-[#FACC15] active:text-black active:border-[#FACC15] transition-all duration-300 ease-in-out flex items-center justify-center gap-2 w-[90%] sm:w-auto mx-auto sm:mx-0"
                onClick={() => trackEvent("demo_scroll", { location: "hero" })}
              >
                <Play className="h-5 w-5" />
                See Demo
              </Link>
            </motion.div>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-[#a1a1a1] mt-6"
            >
              14-day free • No credit card • Cancel anytime
            </motion.p>
          </motion.div>

          {/* Right Column: Product Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 w-full max-w-lg"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-800 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] p-6"
            >
              <div className="bg-black/50 rounded-2xl p-6 border border-gray-700 shadow-inner">
                <h3 className="text-lg font-semibold text-[#FACC15] mb-3">
                  Today&apos;s AI-Crafted Post
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  &quot;Meet Elevora — your AI co-pilot that turns content chaos into clarity. Write smarter, schedule faster, and grow your audience effortlessly.&quot;
                </p>
              </div>
              {/* Subtle glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FACC15]/20 to-transparent opacity-50 blur-xl pointer-events-none" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-28 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <p className="text-sm font-medium text-muted-foreground mb-8">
              Trusted by creators and teams
            </p>

            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16 mb-6 opacity-60 grayscale hover:grayscale-0 transition-all">
              {["TechCrunch", "Indie Hackers", "Product Hunt", "Y Combinator", "Forbes"].map(
                (logo) => (
                  <div
                    key={logo}
                    className="text-lg md:text-xl font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {logo}
                  </div>
                )
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              Join 2,300+ creators using Elevora.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Elevora */}
      <section id="why-elevora" className="py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Everything You Need to Scale Content
            </h2>
            <p className="text-xl text-muted-foreground">
              Built for creators who want consistency without burnout.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: FileText,
                title: "Consistent Output",
                description: "Never stare at a blank page again.",
              },
              {
                icon: Sparkles,
                title: "Your Voice, Not Generic AI",
                description: "Trained on your tone & past content.",
              },
              {
                icon: Calendar,
                title: "Smart Scheduling",
                description: "Auto-posts when engagement peaks.",
              },
              {
                icon: BarChart3,
                title: "Learn What Works",
                description: "Real-time analytics and A/B testing.",
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="h-full rounded-2xl border hover:shadow-md hover:scale-105 transition-all duration-300 bg-white dark:bg-gray-900">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-blue-500" />
                      </div>
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-28 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              How It Works — 3 Simple Steps
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Connect Accounts",
                desc: "Link your social platforms securely.",
                icon: Link2,
                step: "1",
              },
              {
                title: "Train Your Voice",
                desc: "Analyze 10+ posts to learn your tone.",
                icon: Mic,
                step: "2",
              },
              {
                title: "Generate & Schedule",
                desc: "AI creates posts and schedules automatically.",
                icon: Send,
                step: "3",
              },
            ].map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Card className="h-full p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 bg-white dark:bg-gray-900">
                    <div className="flex flex-col items-center text-center space-y-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold border-2 border-background">
                          {step.step}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section id="demo" className="py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              See Elevora in Action
            </h2>
            <p className="text-xl text-muted-foreground">
              Enter your niche and watch AI generate posts across platforms.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8 md:p-12 rounded-2xl shadow-lg bg-white dark:bg-gray-900 mb-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Input
                  placeholder="Enter your niche (e.g., SaaS founders, Fitness coaches)"
                  value={demoNiche}
                  onChange={(e) => setDemoNiche(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && demoNiche.trim() && !demoLoading) {
                      handleDemoGenerate()
                    }
                  }}
                  className="flex-1 rounded-xl"
                />
                <Button
                  onClick={handleDemoGenerate}
                  disabled={!demoNiche.trim() || demoLoading}
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white shadow-lg"
                  size="lg"
                >
                  {demoLoading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </>
                  )}
                </Button>
              </div>

              {/* Platform Selector Grid */}
              {Object.keys(generatedPosts).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <p className="text-sm font-medium text-muted-foreground mb-4">
                    Select a platform to see generated posts:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {platformGroups.map((group) => (
                      <div key={group.group} className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                          {group.group}
                        </p>
                        <div className="space-y-2">
                          {group.platforms.map((platform) => {
                            const Icon = platform.icon
                            const isSelected = selectedPlatform === platform.id
                            const hasPosts = generatedPosts[platform.id]?.length > 0

                            return (
                              <motion.button
                                key={platform.id}
                                onClick={() => handlePlatformSelect(platform.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={!hasPosts}
                                className={`w-full h-[60px] rounded-xl border-2 font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                                  isSelected
                                    ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/30"
                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700"
                                } ${
                                  !hasPosts
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                              >
                                <Icon className="h-5 w-5" />
                                <span>{platform.name}</span>
                              </motion.button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {demoLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground flex items-center justify-center gap-2">
                    <span className="animate-pulse">AI writing</span>
                    <span className="inline-flex gap-1">
                      <span className="animate-bounce [animation-delay:-0.3s]">.</span>
                      <span className="animate-bounce [animation-delay:-0.15s]">.</span>
                      <span className="animate-bounce">.</span>
                    </span>
                  </p>
                </motion.div>
              )}

              {/* Generated Posts */}
              {selectedPlatform && generatedPosts[selectedPlatform] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4 mt-8"
                >
                  <Separator />
                  <div className="flex items-center gap-2 mb-4">
                    {(() => {
                      const platform = platformGroups
                        .flatMap((g) => g.platforms)
                        .find((p) => p.id === selectedPlatform)
                      const Icon = platform?.icon
                      return (
                        Icon && (
                          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-blue-500" />
                          </div>
                        )
                      )
                    })()}
                    <h3 className="text-lg font-semibold">
                      {platformGroups
                        .flatMap((g) => g.platforms)
                        .find((p) => p.id === selectedPlatform)?.name}{" "}
                      Posts
                    </h3>
                  </div>
                  {generatedPosts[selectedPlatform].map((post, postIdx) => (
                    <motion.div
                      key={postIdx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: postIdx * 0.1 }}
                    >
                      <Card className="p-6 rounded-xl border hover:shadow-md transition-shadow bg-white dark:bg-gray-900">
                        <p className="text-sm leading-relaxed whitespace-pre-line">{post}</p>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-28 bg-muted/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Results That Speak
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: TrendingUp,
                stat: "+52%",
                label: "Engagement",
                description: "Measured across creators in 21 days.",
              },
              {
                icon: Clock,
                stat: "7 Hours",
                label: "Saved / Week",
                description: "Creators reclaim time weekly.",
              },
              {
                icon: BarChart3,
                stat: "3x More",
                label: "Posts",
                description: "Consistency drives growth.",
              },
            ].map((result, index) => {
              const Icon = result.icon
              return (
                <motion.div
                  key={result.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="h-full p-8 rounded-2xl border hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-4xl md:text-5xl font-bold">{result.stat}</div>
                        <div className="text-lg font-semibold">{result.label}</div>
                        <p className="text-sm text-muted-foreground">{result.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-28 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Simple, Transparent Pricing
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Solo",
                price: "$19",
                description: "Perfect for individual creators",
                features: [
                  "1 voice profile",
                  "30 posts/month",
                  "Basic scheduling",
                  "Email support",
                ],
                cta: "Start Free",
                popular: false,
              },
              {
                name: "Pro",
                price: "$49",
                description: "For growing creators and teams",
                features: [
                  "3 voice profiles",
                  "200 posts/month",
                  "Advanced analytics",
                  "Smart scheduling",
                  "Priority support",
                  "A/B testing",
                ],
                cta: "Start Free",
                popular: true,
              },
              {
                name: "Growth",
                price: "$99",
                description: "For agencies managing multiple clients",
                features: [
                  "10 voice profiles",
                  "Unlimited posts",
                  "Bulk scheduling",
                  "Advanced analytics",
                  "White-label options",
                  "Dedicated support",
                ],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${tier.popular ? "md:scale-105" : ""}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card
                  className={`h-full flex flex-col rounded-2xl ${
                    tier.popular
                      ? "border-2 border-blue-500 shadow-xl shadow-blue-500/20"
                      : "border"
                  } bg-white dark:bg-gray-900`}
                >
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-2 mb-4">
                      <span className="text-4xl md:text-5xl font-bold">{tier.price}</span>
                      <span className="text-muted-foreground">/mo</span>
                    </div>
                    <CardDescription className="text-base">{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-4 mb-8 flex-1">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-left">
                          <CheckCircle2 className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      variant={tier.popular ? "default" : "outline"}
                      size="lg"
                      className="w-full mt-auto rounded-2xl"
                      onClick={() =>
                        trackEvent("pricing_clicked", {
                          plan: tier.name.toLowerCase(),
                          price: tier.price,
                        })
                      }
                    >
                      <Link href={tier.name === "Growth" ? "/contact" : "/sign-up"}>
                        {tier.cta}
                        <ArrowRight className="ml-2 h-6 w-6" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full text-left">
              {[
                {
                  question: "How does Elevora learn my voice?",
                  answer:
                    "Elevora analyzes your existing posts (10+ recommended) to understand your writing style, voice, tone, and messaging patterns. The AI then generates content that matches your unique brand voice, ensuring consistency across all your posts.",
                },
                {
                  question: "Can I edit posts before publishing?",
                  answer:
                    "Yes! All generated posts can be reviewed and edited before scheduling or publishing. You have full control over your content—edit, approve, or regenerate any post to match your preferences.",
                },
                {
                  question: "Which platforms are supported?",
                  answer:
                    "Currently, Elevora supports X (Twitter), Instagram, LinkedIn, Threads, Bluesky, TikTok, and email newsletters. We&apos;re continuously adding new platforms based on user feedback.",
                },
                {
                  question: "Is my data private and secure?",
                  answer:
                    "Absolutely. Your data is encrypted and stored securely. We never share your content or personal information with third parties. Your posts and voice profiles are private to you and your workspace members only.",
                },
              ].map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-xl border mb-2"
                >
                  <AccordionTrigger className="text-base font-semibold px-6 py-4">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 bg-gradient-to-br from-blue-600 to-cyan-400 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-cyan-400/90" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <Rocket className="h-12 w-12 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Ready to Grow Your Audience?
            </h2>
            <p className="text-white/90 mb-10 max-w-2xl mx-auto text-lg md:text-xl">
              Start free today — no credit card required.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => trackEvent("hero_signup_click", { location: "final_cta" })}
              >
                <Link href="/sign-up">
                  Start Free
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 rounded-2xl"
                onClick={() => trackEvent("demo_scroll", { location: "final_cta" })}
              >
                <Link href="#demo">
                  <Play className="mr-2 h-6 w-6" />
                  See Demo
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 border-t bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Elevora. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
