import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Calendar, Tag } from "lucide-react";
import { CATEGORY_LABELS } from "@/config/categories";

export default async function IssuesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const creator = await prisma.creator.findUnique({
    where: { userId: user.id },
  });

  if (!creator) {
    redirect("/onboarding");
  }

  const issues = await prisma.issue.findMany({
    where: { creatorId: creator.id },
    include: {
      recommendations: {
        select: {
          id: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Issues</h1>
          <p className="text-muted-foreground">
            Manage your newsletter issues and ad recommendations
          </p>
        </div>
        <Link href="/issues/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Issue
          </Button>
        </Link>
      </div>

      {issues.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No issues yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first issue to start receiving ad recommendations
            </p>
            <Link href="/issues/new">
              <Button>Create Your First Issue</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {issues.map((issue) => {
            const pending = issue.recommendations.filter(
              (r) => r.status === "PENDING"
            ).length;
            const approved = issue.recommendations.filter(
              (r) => r.status === "APPROVED"
            ).length;
            const rejected = issue.recommendations.filter(
              (r) => r.status === "REJECTED"
            ).length;

            return (
              <Card key={issue.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        <Link
                          href={`/issues/${issue.id}`}
                          className="hover:underline"
                        >
                          {issue.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {issue.summary?.slice(0, 150)}
                        {issue.summary && issue.summary.length > 150
                          ? "..."
                          : ""}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/issues/${issue.id}/recommendations`}>
                        <Button variant="outline" size="sm">
                          View Ads
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {issue.createdAt.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      {CATEGORY_LABELS[issue.classifiedCategory]}
                    </div>
                    <div className="flex items-center gap-2">
                      {pending > 0 && (
                        <Badge variant="secondary">{pending} pending</Badge>
                      )}
                      {approved > 0 && (
                        <Badge className="bg-green-100 text-green-800">
                          {approved} approved
                        </Badge>
                      )}
                      {rejected > 0 && (
                        <Badge variant="destructive">{rejected} rejected</Badge>
                      )}
                      {issue.recommendations.length === 0 && (
                        <Badge variant="outline">No recommendations</Badge>
                      )}
                    </div>
                  </div>
                  {issue.extractedKeywords.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {issue.extractedKeywords.slice(0, 5).map((keyword) => (
                        <Badge key={keyword} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {issue.extractedKeywords.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{issue.extractedKeywords.length - 5} more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
