import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Eye, MousePointer, DollarSign, Plus } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user has completed onboarding
  const creator = await prisma.creator.findUnique({
    where: { userId: user.id },
    include: {
      boundaries: true,
      issues: {
        include: {
          recommendations: {
            include: {
              events: true,
            },
          },
        },
      },
    },
  });

  if (!creator || !creator.onboardingComplete) {
    redirect("/onboarding");
  }

  // Calculate metrics
  const totalIssues = creator.issues.length;
  const allRecommendations = creator.issues.flatMap((i) => i.recommendations);
  const approvedRecommendations = allRecommendations.filter(
    (r) => r.status === "APPROVED"
  );

  const allEvents = allRecommendations.flatMap((r) => r.events);
  const impressions = allEvents.filter((e) => e.type === "IMPRESSION").length;
  const clicks = allEvents.filter((e) => e.type === "CLICK").length;
  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : "0";

  // Estimated revenue (mocked CPM of $5)
  const estimatedRevenue = ((impressions / 1000) * 5).toFixed(2);

  const recentIssues = creator.issues
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {creator.newsletterName}
          </p>
        </div>
        <Link href="/issues/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Issue
          </Button>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIssues}</div>
            <p className="text-xs text-muted-foreground">
              {approvedRecommendations.length} approved ads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {impressions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total ad views across all issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{ctr}% CTR</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${estimatedRevenue}</div>
            <p className="text-xs text-muted-foreground">Based on $5 CPM</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Issues</CardTitle>
          <CardDescription>
            Your latest newsletter issues and their ad recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold">No issues yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first issue to start getting ad recommendations
              </p>
              <Link href="/issues/new">
                <Button>Create Issue</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentIssues.map((issue) => {
                const issueRecs = issue.recommendations;
                const pending = issueRecs.filter(
                  (r) => r.status === "PENDING"
                ).length;
                const approved = issueRecs.filter(
                  (r) => r.status === "APPROVED"
                ).length;

                return (
                  <div
                    key={issue.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div>
                      <Link
                        href={`/issues/${issue.id}`}
                        className="font-medium hover:underline"
                      >
                        {issue.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {issue.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {pending > 0 && (
                        <span className="text-sm text-yellow-600">
                          {pending} pending
                        </span>
                      )}
                      {approved > 0 && (
                        <span className="text-sm text-green-600">
                          {approved} approved
                        </span>
                      )}
                      <Link href={`/issues/${issue.id}/recommendations`}>
                        <Button variant="outline" size="sm">
                          View Ads
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monetization Status */}
      {!creator.boundaries && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">
              Complete Your Monetization Setup
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Set your ad preferences to start receiving relevant ad
              recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/boundaries">
              <Button variant="outline">Set Up Monetization</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
