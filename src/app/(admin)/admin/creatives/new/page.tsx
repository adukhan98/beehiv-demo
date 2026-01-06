"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";

interface Campaign {
    id: string;
    name: string;
    advertiser: {
        name: string;
    };
}

export default function NewCreativePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);

    const [formData, setFormData] = useState({
        campaignId: "",
        headline: "",
        body: "",
        imageUrl: "",
        ctaText: "Learn More",
        destinationUrl: "",
        tone: "PROFESSIONAL",
    });

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await fetch("/api/campaigns");
                if (response.ok) {
                    const data = await response.json();
                    setCampaigns(data);
                }
            } catch (err) {
                console.error("Error fetching campaigns:", err);
            }
        };
        fetchCampaigns();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/creatives", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create creative");
            }

            router.push("/admin/creatives");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/creatives">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">New Creative</h1>
                    <p className="text-muted-foreground">Create a new ad creative</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Creative Details</CardTitle>
                    <CardDescription>
                        Design your ad creative for newsletter placement
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="campaignId">Campaign *</Label>
                            <Select
                                value={formData.campaignId}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, campaignId: value })
                                }
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a campaign" />
                                </SelectTrigger>
                                <SelectContent>
                                    {campaigns.map((campaign) => (
                                        <SelectItem key={campaign.id} value={campaign.id}>
                                            {campaign.name} ({campaign.advertiser.name})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="headline">Headline *</Label>
                            <Input
                                id="headline"
                                placeholder="Boost Your Productivity Today"
                                value={formData.headline}
                                onChange={(e) =>
                                    setFormData({ ...formData, headline: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="body">Body Text *</Label>
                            <Textarea
                                id="body"
                                placeholder="Discover our innovative solution that helps teams work smarter..."
                                value={formData.body}
                                onChange={(e) =>
                                    setFormData({ ...formData, body: e.target.value })
                                }
                                rows={4}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input
                                id="imageUrl"
                                type="url"
                                placeholder="https://example.com/ad-image.jpg"
                                value={formData.imageUrl}
                                onChange={(e) =>
                                    setFormData({ ...formData, imageUrl: e.target.value })
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ctaText">CTA Text</Label>
                                <Input
                                    id="ctaText"
                                    placeholder="Learn More"
                                    value={formData.ctaText}
                                    onChange={(e) =>
                                        setFormData({ ...formData, ctaText: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tone">Tone</Label>
                                <Select
                                    value={formData.tone}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, tone: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                                        <SelectItem value="CASUAL">Casual</SelectItem>
                                        <SelectItem value="FRIENDLY">Friendly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="destinationUrl">Destination URL *</Label>
                            <Input
                                id="destinationUrl"
                                type="url"
                                placeholder="https://example.com/landing-page"
                                value={formData.destinationUrl}
                                onChange={(e) =>
                                    setFormData({ ...formData, destinationUrl: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Creative"
                                )}
                            </Button>
                            <Link href="/admin/creatives">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
