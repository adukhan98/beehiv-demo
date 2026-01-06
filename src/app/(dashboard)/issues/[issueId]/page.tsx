import { prisma } from "@/lib/prisma/client";
import { notFound } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    Tag,
    FileText,
    Sparkles,
    CheckCircle2,
    Clock
} from "lucide-react";
import { CATEGORY_LABELS } from "@/config/categories";

interface Props {
    params: Promise<{ issueId: string }>;
}

export default async function IssueDetailPage({ params }: Props) {
    const { issueId } = await params;

    const issue = await prisma.issue.findUnique({
        where: { id: issueId },
        include: {
            creator: {
                select: { newsletterName: true },
            },
            _count: {
                select: { recommendations: true },
            },
        },
    });

    if (!issue) {
        notFound();
    }

    const approvedCount = await prisma.recommendation.count({
        where: { issueId, status: "APPROVED" },
    });

    const pendingCount = await prisma.recommendation.count({
        where: { issueId, status: "PENDING" },
    });

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
                <div className="flex items-start gap-4">
                    <Link href="/issues">
                        <Button variant="ghost" size="icon" className="h-10 w-10 bg-background/50 hover:bg-background border border-border/50">
                            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </Link>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">{issue.title}</h1>
                            <Badge variant="outline" className="ml-2 font-normal bg-background/50">
                                {CATEGORY_LABELS[issue.classifiedCategory]}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground font-medium flex items-center gap-2">
                            <span className="text-foreground">{issue.creator.newsletterName}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-xs uppercase tracking-wider font-semibold">
                                <Calendar className="h-3 w-3" />
                                {issue.publishDate
                                    ? new Date(issue.publishDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
                                    : "Draft"}
                            </span>
                        </p>
                    </div>
                </div>
                <Link href={`/issues/${issueId}/recommendations`}>
                    <Button size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                        View Recommendations
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass-card bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-900/10 border-green-200/50 dark:border-green-800/20">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-green-700 dark:text-green-400 font-medium flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" /> Approved Ads
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-green-700 dark:text-green-400 tracking-tight">
                            {approvedCount}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card bg-gradient-to-br from-yellow-50/50 to-transparent dark:from-yellow-900/10 border-yellow-200/50 dark:border-yellow-800/20">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-yellow-700 dark:text-yellow-400 font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4" /> Pending Review
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-yellow-700 dark:text-yellow-400 tracking-tight">
                            {pendingCount}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader className="pb-2">
                        <CardDescription className="font-medium flex items-center gap-2">
                            Total Opportunity
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tight text-foreground">
                            {issue._count.recommendations}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* AI Analysis Column */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="glass-card border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <Sparkles className="h-5 w-5" />
                                AI Content Analysis
                            </CardTitle>
                            <CardDescription>
                                Insights extracted from your newsletter content
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <Tag className="h-3 w-3" /> Identified Keywords
                                </h3>
                                {issue.extractedKeywords.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {issue.extractedKeywords.map((keyword: string, index: number) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="bg-background/80 hover:bg-background border-primary/10 text-primary px-3 py-1 text-sm font-medium"
                                            >
                                                {keyword}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-sm italic">
                                        No keywords extracted yet
                                    </p>
                                )}
                            </div>

                            <Separator className="bg-primary/10" />

                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="h-3 w-3" /> Summary
                                </h3>
                                <div className="bg-background/40 rounded-lg p-4 border border-border/50 text-sm leading-relaxed text-foreground/90">
                                    {issue.summary || "No summary generated yet."}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <Card className="h-full border-border/40 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Newsletter Content</CardTitle>
                            <CardDescription>Preview of original text</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                <div className="whitespace-pre-wrap text-xs text-muted-foreground leading-relaxed line-clamp-[20]">
                                    {issue.content}
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full mt-4 text-xs">
                                View Full Content
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
