"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  ArrowLeft,
  Check,
  X,
  RefreshCw,
  Copy,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { CATEGORY_LABELS } from "@/config/categories";
import { Category } from "@prisma/client";

interface Recommendation {
  id: string;
  matchScore: number;
  matchReasons: string[];
  rank: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  creative: {
    id: string;
    headline: string;
    body: string;
    imageUrl: string | null;
    ctaText: string;
    destinationUrl: string;
    tone: string;
    campaign: {
      name: string;
      cpm: number;
      targetCategories: Category[];
      advertiser: {
        name: string;
      };
    };
  };
}

interface Issue {
  id: string;
  title: string;
  summary: string;
  classifiedCategory: Category;
  extractedKeywords: string[];
}

export default function RecommendationsPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params.issueId as string;

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [issue, setIssue] = useState<Issue | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRecId, setSelectedRecId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportHtml, setExportHtml] = useState("");
  const [exportLoading, setExportLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [issueRes, recsRes] = await Promise.all([
        fetch(`/api/issues/${issueId}`),
        fetch(`/api/issues/${issueId}/recommendations`),
      ]);

      if (!issueRes.ok) throw new Error("Failed to fetch issue");
      if (!recsRes.ok) throw new Error("Failed to fetch recommendations");

      const issueData = await issueRes.json();
      const recsData = await recsRes.json();

      setIssue(issueData);
      setRecommendations(recsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [issueId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const generateRecommendations = async () => {
    setGenerating(true);
    setError(null);

    try {
      const response = await fetch(`/api/issues/${issueId}/recommendations`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate recommendations");
      }

      const newRecs = await response.json();
      setRecommendations(newRecs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setGenerating(false);
    }
  };

  const handleApprove = async (recId: string) => {
    try {
      const response = await fetch(`/api/recommendations/${recId}/approve`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to approve");

      setRecommendations((prev) =>
        prev.map((r) => (r.id === recId ? { ...r, status: "APPROVED" } : r))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve ad");
    }
  };

  const handleReject = async () => {
    if (!selectedRecId) return;

    try {
      const response = await fetch(
        `/api/recommendations/${selectedRecId}/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: rejectionReason }),
        }
      );

      if (!response.ok) throw new Error("Failed to reject");

      setRecommendations((prev) =>
        prev.map((r) =>
          r.id === selectedRecId
            ? { ...r, status: "REJECTED", rejectionReason }
            : r
        )
      );

      setRejectDialogOpen(false);
      setSelectedRecId(null);
      setRejectionReason("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject ad");
    }
  };

  const handleExport = async (recId: string) => {
    setExportLoading(true);
    setExportDialogOpen(true);

    try {
      const response = await fetch(`/api/recommendations/${recId}/export`);
      if (!response.ok) throw new Error("Failed to generate export");

      const data = await response.json();
      setExportHtml(data.html);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export");
    } finally {
      setExportLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportHtml);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Issue not found</p>
        <Link href="/issues">
          <Button className="mt-4">Back to Issues</Button>
        </Link>
      </div>
    );
  }

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
            Category: {CATEGORY_LABELS[issue.classifiedCategory]}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={generateRecommendations}
          disabled={generating}
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Ads
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recommendations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              No ad recommendations available for this issue.
            </p>
            <Button onClick={generateRecommendations} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Recommendations"
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <Card
              key={rec.id}
              className={
                rec.status === "APPROVED"
                  ? "border-green-200"
                  : rec.status === "REJECTED"
                  ? "border-red-200 opacity-60"
                  : ""
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {rec.creative.headline}
                      <Badge
                        variant={
                          rec.status === "APPROVED"
                            ? "default"
                            : rec.status === "REJECTED"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {rec.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {rec.creative.campaign.advertiser.name} •{" "}
                      {rec.creative.campaign.name}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      ${rec.creative.campaign.cpm} CPM
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Score: {rec.matchScore.toFixed(1)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{rec.creative.body}</p>

                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">{rec.creative.ctaText}</Badge>
                  <a
                    href={rec.creative.destinationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    View destination <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="flex flex-wrap gap-1">
                  {rec.matchReasons.map((reason, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {reason}
                    </Badge>
                  ))}
                </div>

                {rec.status === "REJECTED" && rec.rejectionReason && (
                  <p className="text-sm text-red-600">
                    Rejection reason: {rec.rejectionReason}
                  </p>
                )}

                {rec.status === "PENDING" && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleApprove(rec.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedRecId(rec.id);
                        setRejectDialogOpen(true);
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}

                {rec.status === "APPROVED" && (
                  <Button
                    variant="outline"
                    onClick={() => handleExport(rec.id)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Export HTML
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Ad</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this ad recommendation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Not relevant to my audience..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Ad
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export Ad HTML</DialogTitle>
            <DialogDescription>
              Copy this HTML snippet and paste it into your newsletter.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {exportLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Textarea
                value={exportHtml}
                readOnly
                rows={12}
                className="font-mono text-xs"
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={copyToClipboard} disabled={exportLoading}>
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
