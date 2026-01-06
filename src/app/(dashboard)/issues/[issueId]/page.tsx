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
import { ArrowLeft, ArrowRight, Calendar, Tag, FileText } from "lucide-react";
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
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/issues">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight">{issue.title}</h1>
                    <p className="text-muted-foreground text-sm">
                        {issue.creator.newsletterName}
                    </p>
                </div>
                <Link href={`/issues/${issueId}/recommendations`}>
                    <Button>
                        View Recommendations
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Badge variant="default" className="text-sm">
                            {CATEGORY_LABELS[issue.classifiedCategory]}
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Ad Recommendations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Badge variant="default">{approvedCount} Approved</Badge>
                            <Badge variant="secondary">{pendingCount} Pending</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Publish Date</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                            {issue.publishDate
                                ? new Date(issue.publishDate).toLocaleDateString()
                                : "Not scheduled"}
                        </span>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            AI-Extracted Keywords
                        </CardTitle>
                        <CardDescription>
                            Keywords automatically identified from your content
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {issue.extractedKeywords.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {issue.extractedKeywords.map((keyword: string, index: number) => (
                                    <Badge key={index} variant="outline">
                                        {keyword}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm">
                                No keywords extracted yet
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            AI Summary
                        </CardTitle>
                        <CardDescription>
                            Automatically generated content summary
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {issue.summary ? (
                            <p className="text-sm leading-relaxed">{issue.summary}</p>
                        ) : (
                            <p className="text-muted-foreground text-sm">
                                No summary generated yet
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Issue Content</CardTitle>
                    <CardDescription>Full newsletter content</CardDescription>
                </CardHeader>
                <CardContent>
                    <Separator className="mb-4" />
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {issue.content}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Link href="/issues">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Issues
                    </Button>
                </Link>
                <Link href={`/issues/${issueId}/recommendations`}>
                    <Button>
                        Manage Ad Recommendations
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
