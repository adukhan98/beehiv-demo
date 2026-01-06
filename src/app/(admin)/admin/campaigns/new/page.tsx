"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { CATEGORY_OPTIONS } from "@/config/categories";
import { Category } from "@prisma/client";

interface Advertiser {
  id: string;
  name: string;
}

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);

  const [formData, setFormData] = useState({
    advertiserId: "",
    name: "",
    description: "",
    targetCategories: [] as Category[],
    targetKeywords: "",
    budget: "",
    cpm: "",
    startDate: "",
    endDate: "",
    status: "DRAFT",
  });

  useEffect(() => {
    const fetchAdvertisers = async () => {
      try {
        const response = await fetch("/api/advertisers");
        if (response.ok) {
          const data = await response.json();
          setAdvertisers(data);
        }
      } catch (err) {
        console.error("Error fetching advertisers:", err);
      }
    };
    fetchAdvertisers();
  }, []);

  const toggleCategory = (category: Category) => {
    setFormData((prev) => ({
      ...prev,
      targetCategories: prev.targetCategories.includes(category)
        ? prev.targetCategories.filter((c) => c !== category)
        : [...prev.targetCategories, category],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          targetKeywords: formData.targetKeywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
          budget: formData.budget ? parseFloat(formData.budget) : 0,
          cpm: formData.cpm ? parseFloat(formData.cpm) : 0,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create campaign");
      }

      router.push("/admin/campaigns");
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
        <Link href="/admin/campaigns">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Campaign</h1>
          <p className="text-muted-foreground">Create a new advertising campaign</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <CardDescription>Configure your campaign settings</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="advertiserId">Advertiser *</Label>
              <Select
                value={formData.advertiserId}
                onValueChange={(value) =>
                  setFormData({ ...formData, advertiserId: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an advertiser" />
                </SelectTrigger>
                <SelectContent>
                  {advertisers.map((adv) => (
                    <SelectItem key={adv.id} value={adv.id}>
                      {adv.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                placeholder="Summer Sale 2024"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Campaign description..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Target Categories</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORY_OPTIONS.filter((opt) => opt.value !== "OTHER").map(
                  (option) => (
                    <div key={option.value} className="flex items-center gap-2">
                      <Checkbox
                        id={`cat-${option.value}`}
                        checked={formData.targetCategories.includes(option.value)}
                        onCheckedChange={() => toggleCategory(option.value)}
                      />
                      <Label
                        htmlFor={`cat-${option.value}`}
                        className="text-sm cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetKeywords">Target Keywords</Label>
              <Input
                id="targetKeywords"
                placeholder="ai, machine learning, tech"
                value={formData.targetKeywords}
                onChange={(e) =>
                  setFormData({ ...formData, targetKeywords: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated keywords
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  placeholder="1000"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpm">CPM ($)</Label>
                <Input
                  id="cpm"
                  type="number"
                  step="0.01"
                  placeholder="5.00"
                  value={formData.cpm}
                  onChange={(e) =>
                    setFormData({ ...formData, cpm: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PAUSED">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Campaign"
                )}
              </Button>
              <Link href="/admin/campaigns">
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
