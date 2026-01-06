import { prisma } from "@/lib/prisma/client";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, ExternalLink, Image } from "lucide-react";
import { TonePreference } from "@prisma/client";

const TONE_COLORS: Record<TonePreference, "default" | "secondary" | "outline"> = {
    PROFESSIONAL: "default",
    CASUAL: "secondary",
    FRIENDLY: "outline",
};

export default async function CreativesPage() {
    const creatives = await prisma.adCreative.findMany({
        include: {
            campaign: {
                include: {
                    advertiser: {
                        select: { name: true },
                    },
                },
            },
            _count: {
                select: { recommendations: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Ad Creatives</h1>
                    <p className="text-muted-foreground">
                        Manage ad creatives for your campaigns
                    </p>
                </div>
                <Link href="/admin/creatives/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Creative
                    </Button>
                </Link>
            </div>

            {creatives.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Image className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">No creatives yet</p>
                        <Link href="/admin/creatives/new">
                            <Button>Create Your First Creative</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>All Creatives</CardTitle>
                        <CardDescription>
                            {creatives.length} creative(s) available
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Headline</TableHead>
                                    <TableHead>Campaign</TableHead>
                                    <TableHead>Advertiser</TableHead>
                                    <TableHead>Tone</TableHead>
                                    <TableHead>CTA</TableHead>
                                    <TableHead>Recommendations</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Link</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {creatives.map((creative) => (
                                    <TableRow key={creative.id}>
                                        <TableCell className="font-medium max-w-[200px] truncate">
                                            {creative.headline}
                                        </TableCell>
                                        <TableCell>{creative.campaign.name}</TableCell>
                                        <TableCell>{creative.campaign.advertiser.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={TONE_COLORS[creative.tone]}>
                                                {creative.tone}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{creative.ctaText}</Badge>
                                        </TableCell>
                                        <TableCell>{creative._count.recommendations}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={creative.isActive ? "default" : "secondary"}
                                            >
                                                {creative.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <a
                                                href={creative.destinationUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-blue-600 hover:underline"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
