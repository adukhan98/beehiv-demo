import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sparkles,
  Shield,
  BarChart3,
  Zap,
  Mail,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Globe
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 z-[-1] opacity-30 dark:opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-secondary/30 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-accent/20 blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-border/40 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary p-1.5 shadow-lg shadow-primary/20">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">NewsletterAds</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="font-medium text-muted-foreground hover:text-foreground">Sign In</Button>
              </Link>
              <Link href="/login">
                <Button className="font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 sm:pt-32 sm:pb-40 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8 shadow-sm backdrop-blur-sm animate-fade-in-up">
              <Sparkles className="h-4 w-4" />
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">AI-Powered Ad Matching Engine</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-foreground mb-8 leading-[1.1] animate-fade-in-up animation-delay-150">
              Monetize Your Newsletter<br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  The Intelligent Way
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/10 -z-10 skew-x-[-12deg]" />
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground mb-12 leading-relaxed animate-fade-in-up animation-delay-300">
              Stop manually hunting for sponsors. Our AI analyzes your content directly from Substack or Beehiiv and matches you with premium advertisers instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-450">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto px-8 h-12 text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 transition-all">
                  Start Earning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/admin">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-12 text-base glass hover:bg-white/40 dark:hover:bg-zinc-800/40 opacity-90 hover:opacity-100 hover:-translate-y-1 transition-all">
                  Advertiser Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Abstract shapes/grid */}
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-background to-transparent z-0" />
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-border/40 bg-muted/30 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8 opacity-70">Trusted by modern newsletters</p>
          <div className="flex flex-wrap justify-center gap-12 sm:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-xl font-bold font-sans"><TrendingUp className="h-6 w-6" /> GrowthDaily</div>
            <div className="flex items-center gap-2 text-xl font-bold font-serif"><Globe className="h-6 w-6" /> TechWorld</div>
            <div className="flex items-center gap-2 text-xl font-bold font-mono"><Zap className="h-6 w-6" /> CodeDigest</div>
            <div className="flex items-center gap-2 text-xl font-bold"><Shield className="h-6 w-6" /> CryptoSecure</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-6 relative inline-block">
              Why Creators Love Us
              <div className="absolute -right-6 -top-6 text-yellow-400 rotate-12">
                <Sparkles className="h-8 w-8 fill-current" />
              </div>
            </h2>
            <p className="text-xl text-muted-foreground">
              We've redesigned the sponsorship workflow from the ground up.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Sparkles,
                color: "text-purple-600",
                bg: "bg-purple-600/10",
                title: "AI Content Analysis",
                description: "Our proprietary AI engine reads your newsletter issues and extracts semantic meaning to find perfect brand alignment."
              },
              {
                icon: Shield,
                color: "text-green-600",
                bg: "bg-green-600/10",
                title: "Brand Safety Controls",
                description: "Granular control over categories and specific advertisers. Nothing goes into your newsletter without your say-so."
              },
              {
                icon: BarChart3,
                color: "text-blue-600",
                bg: "bg-blue-600/10",
                title: "Real-time Analytics",
                description: "Track clicks, conversions, and payouts in real-time. Beautiful dashboards that show your growth."
              },
              {
                icon: Zap,
                color: "text-yellow-600",
                bg: "bg-yellow-600/10",
                title: "One-Click Export",
                description: "Export magic links or HTML snippets directly to your ESP. Compatible with every major platform."
              },
              {
                icon: CheckCircle,
                color: "text-orange-600",
                bg: "bg-orange-600/10",
                title: "Easy Approval Flow",
                description: "Swipe-style interface to approve or reject ad creative. Managing sponsors feels like a game."
              },
              {
                icon: Mail,
                color: "text-pink-600",
                bg: "bg-pink-600/10",
                title: "Universal Compatibility",
                description: "Works seamlessly with Beehiiv, Substack, ConvertKit, Mailchimp, and custom HTML newsletters."
              }
            ].map((feature, i) => (
              <Card key={i} className="glass-card hover:border-primary/20 group">
                <CardHeader>
                  <div className={`h-12 w-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl tracking-tight">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-muted/30 border-y border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-lg text-muted-foreground">
              Turn your audience into revenue in three simple steps.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

            <div className="text-center relative">
              <div className="mx-auto h-20 w-20 rounded-2xl bg-white dark:bg-zinc-900 border border-border shadow-stacked flex items-center justify-center text-3xl font-bold text-primary mb-6 rotate-3 hover:rotate-0 transition-all duration-300 z-10">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Create Your Issue</h3>
              <p className="text-muted-foreground text-lg leading-relaxed px-4">
                Paste your newsletter content or sync with your provider.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-20 w-20 rounded-2xl bg-white dark:bg-zinc-900 border border-border shadow-stacked flex items-center justify-center text-3xl font-bold text-primary mb-6 -rotate-3 hover:rotate-0 transition-all duration-300 z-10">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Match & Review</h3>
              <p className="text-muted-foreground text-lg leading-relaxed px-4">
                Our AI ranks the best ads. You approve what fits your vibe.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-20 w-20 rounded-2xl bg-white dark:bg-zinc-900 border border-border shadow-stacked flex items-center justify-center text-3xl font-bold text-primary mb-6 rotate-2 hover:rotate-0 transition-all duration-300 z-10">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Export & Earn</h3>
              <p className="text-muted-foreground text-lg leading-relaxed px-4">
                Copy the magic tracking code and watch the payouts roll in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary z-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-transparent to-black/20 transform rotate-12"></div>
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tighter">
            Ready to monetize smoothly?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of creators who are saving time and earning more with automated ad operations.
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="px-10 h-14 text-lg shadow-2xl shadow-black/20 border-0 hover:scale-105 transition-all duration-300">
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-6 text-sm text-primary-foreground/60 font-medium">No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-muted p-1">
                <Mail className="h-4 w-4 text-foreground" />
              </div>
              <span className="font-semibold tracking-tight text-sm">NewsletterAds</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} NewsletterAds. Built with ❤️ for creators.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
