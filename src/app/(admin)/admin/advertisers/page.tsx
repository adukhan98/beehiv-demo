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
import { Plus, ExternalLink } from "lucide-react";

export default async function AdvertisersPage() {
  const advertisers = await prisma.advertiser.findMany({
    include: {
      _count: {
        select: { campaigns: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advertisers</h1>
          <p className="text-muted-foreground">
            Manage advertiser accounts and their campaigns
          </p>
        </div>
        <Link href="/admin/advertisers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Advertiser
          </Button>
        </Link>
      </div>

      {advertisers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No advertisers yet</p>
            <Link href="/admin/advertisers/new">
              <Button>Add Your First Advertiser</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Advertisers</CardTitle>
            <CardDescription>
              {advertisers.length} advertiser(s) registered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Campaigns</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {advertisers.map((advertiser) => (
                  <TableRow key={advertiser.id}>
                    <TableCell className="font-medium">
                      {advertiser.name}
                    </TableCell>
                    <TableCell>{advertiser.contactEmail}</TableCell>
                    <TableCell>
                      {advertiser.website ? (
                        <a
                          href={advertiser.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          Visit <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{advertiser._count.campaigns}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          advertiser.isActive ? "default" : "secondary"
                        }
                      >
                        {advertiser.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {advertiser.createdAt.toLocaleDateString()}
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
