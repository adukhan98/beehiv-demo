"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Loader2 } from "lucide-react";
import { CATEGORY_OPTIONS } from "@/config/categories";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    newsletterName: "",
    newsletterUrl: "",
    description: "",
    subscriberCount: "",
    averageOpenRate: "",
    primaryCategory: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          subscriberCount: formData.subscriberCount
            ? parseInt(formData.subscriberCount)
            : null,
          averageOpenRate: formData.averageOpenRate
            ? parseFloat(formData.averageOpenRate)
            : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save profile");
      }

      router.push("/boundaries");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to AdNetwork</CardTitle>
          <CardDescription>
            Let&apos;s get your newsletter set up for monetization. This
            information helps us match you with relevant advertisers.
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
              <Label htmlFor="newsletterName">Newsletter Name *</Label>
              <Input
                id="newsletterName"
                placeholder="My Awesome Newsletter"
                value={formData.newsletterName}
                onChange={(e) =>
                  setFormData({ ...formData, newsletterName: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newsletterUrl">Newsletter URL</Label>
              <Input
                id="newsletterUrl"
                type="url"
                placeholder="https://myawesomenewsletter.com"
                value={formData.newsletterUrl}
                onChange={(e) =>
                  setFormData({ ...formData, newsletterUrl: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your newsletter and audience..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryCategory">Primary Category *</Label>
              <Select
                value={formData.primaryCategory}
                onValueChange={(value) =>
                  setFormData({ ...formData, primaryCategory: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subscriberCount">Subscriber Count</Label>
                <Input
                  id="subscriberCount"
                  type="number"
                  placeholder="1000"
                  value={formData.subscriberCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subscriberCount: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="averageOpenRate">Average Open Rate (%)</Label>
                <Input
                  id="averageOpenRate"
                  type="number"
                  step="0.1"
                  placeholder="45.5"
                  value={formData.averageOpenRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      averageOpenRate: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Continue to Monetization Settings"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
