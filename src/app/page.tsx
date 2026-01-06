import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Navigation */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">NewsletterAds</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/login">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Ad Matching
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
              Monetize Your Newsletter
              <br />
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                The Smart Way
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-10">
              Connect with premium advertisers automatically. Our AI analyzes your
              content and matches you with relevant, high-paying ads that your
              audience will actually appreciate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto px-8">
                  Start Earning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/admin">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                  Advertiser Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              Why Creators Love Us
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Everything you need to turn your newsletter into a revenue stream
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI Content Analysis</CardTitle>
                <CardDescription>
                  Our AI extracts keywords, classifies topics, and summarizes your
                  content to find the perfect ad matches.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Brand Safety Controls</CardTitle>
                <CardDescription>
                  Set boundaries for categories and brands. You stay in control of
                  what ads appear in your newsletter.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Performance Tracking</CardTitle>
                <CardDescription>
                  Track impressions, clicks, and revenue with built-in analytics.
                  Know exactly how your ads perform.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>One-Click Export</CardTitle>
                <CardDescription>
                  Export ready-to-use HTML snippets with tracking pixels. Just
                  paste into your email tool.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Easy Approval Flow</CardTitle>
                <CardDescription>
                  Review and approve ads before they go live. Reject any that
                  don&apos;t fit your brand.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Works With Any ESP</CardTitle>
                <CardDescription>
                  Compatible with Beehiiv, Substack, ConvertKit, Mailchimp, and
                  any other email service provider.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Get started in minutes, not days
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Issue</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Paste your newsletter content. Our AI analyzes it instantly.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Review Matches</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                See AI-recommended ads ranked by relevance. Approve the ones you
                like.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Export & Earn</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Copy the HTML, paste it in your newsletter, and start earning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Monetize Your Newsletter?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Join hundreds of creators earning from their content with
            AI-matched ads.
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="px-8">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">NewsletterAds</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} NewsletterAds. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
