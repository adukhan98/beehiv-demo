"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import { Loader2, X } from "lucide-react";
import { CATEGORY_OPTIONS } from "@/config/categories";
import { Category, TonePreference, ApprovalMode } from "@prisma/client";

const TONE_OPTIONS = [
  { value: "PROFESSIONAL", label: "Professional" },
  { value: "CASUAL", label: "Casual" },
  { value: "FRIENDLY", label: "Friendly" },
];

export default function BoundariesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newBrand, setNewBrand] = useState("");

  const [formData, setFormData] = useState({
    allowedCategories: [] as Category[],
    blockedCategories: [] as Category[],
    blockedBrands: [] as string[],
    maxAdsPerIssue: 3,
    approvalMode: "MANUAL" as ApprovalMode,
    preferredTone: "PROFESSIONAL" as TonePreference,
    minCpm: "",
  });

  useEffect(() => {
    const fetchBoundaries = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/creators/boundaries");
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setFormData({
              allowedCategories: data.allowedCategories || [],
              blockedCategories: data.blockedCategories || [],
              blockedBrands: data.blockedBrands || [],
              maxAdsPerIssue: data.maxAdsPerIssue || 3,
              approvalMode: data.approvalMode || "MANUAL",
              preferredTone: data.preferredTone || "PROFESSIONAL",
              minCpm: data.minCpm?.toString() || "",
            });
          }
        }
      } catch (err) {
        console.error("Error fetching boundaries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoundaries();
  }, []);

  const toggleCategory = (
    category: Category,
    list: "allowedCategories" | "blockedCategories"
  ) => {
    setFormData((prev) => {
      const current = prev[list];
      const newList = current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category];

      // If adding to allowed, remove from blocked and vice versa
      const otherList =
        list === "allowedCategories" ? "blockedCategories" : "allowedCategories";
      const otherListFiltered = prev[otherList].filter((c) => c !== category);

      return {
        ...prev,
        [list]: newList,
        [otherList]: otherListFiltered,
      };
    });
  };

  const addBlockedBrand = () => {
    if (newBrand.trim() && !formData.blockedBrands.includes(newBrand.trim())) {
      setFormData((prev) => ({
        ...prev,
        blockedBrands: [...prev.blockedBrands, newBrand.trim()],
      }));
      setNewBrand("");
    }
  };

  const removeBlockedBrand = (brand: string) => {
    setFormData((prev) => ({
      ...prev,
      blockedBrands: prev.blockedBrands.filter((b) => b !== brand),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/creators/boundaries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          minCpm: formData.minCpm ? parseFloat(formData.minCpm) : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save settings");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Monetization Settings
        </h1>
        <p className="text-muted-foreground">
          Configure your ad preferences. These settings control which ads can be
          recommended for your newsletter.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              Settings saved successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Allowed Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Allowed Categories</CardTitle>
            <CardDescription>
              Select categories you want to receive ads from. Leave empty to
              allow all categories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORY_OPTIONS.filter((opt) => opt.value !== "OTHER").map(
                (option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`allowed-${option.value}`}
                      checked={formData.allowedCategories.includes(
                        option.value
                      )}
                      onCheckedChange={() =>
                        toggleCategory(option.value, "allowedCategories")
                      }
                    />
                    <Label
                      htmlFor={`allowed-${option.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Blocked Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Blocked Categories</CardTitle>
            <CardDescription>
              Select categories you never want to see ads from.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORY_OPTIONS.filter((opt) => opt.value !== "OTHER").map(
                (option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`blocked-${option.value}`}
                      checked={formData.blockedCategories.includes(
                        option.value
                      )}
                      onCheckedChange={() =>
                        toggleCategory(option.value, "blockedCategories")
                      }
                    />
                    <Label
                      htmlFor={`blocked-${option.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Blocked Brands */}
        <Card>
          <CardHeader>
            <CardTitle>Blocked Brands</CardTitle>
            <CardDescription>
              Add specific brands or companies you don&apos;t want to advertise.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter brand name"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addBlockedBrand();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addBlockedBrand}>
                Add
              </Button>
            </div>
            {formData.blockedBrands.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.blockedBrands.map((brand) => (
                  <Badge
                    key={brand}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeBlockedBrand(brand)}
                  >
                    {brand}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Fine-tune your ad experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxAdsPerIssue">Max Ads Per Issue</Label>
                <Select
                  value={formData.maxAdsPerIssue.toString()}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      maxAdsPerIssue: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 ad</SelectItem>
                    <SelectItem value="2">2 ads</SelectItem>
                    <SelectItem value="3">3 ads</SelectItem>
                    <SelectItem value="4">4 ads</SelectItem>
                    <SelectItem value="5">5 ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredTone">Preferred Ad Tone</Label>
                <Select
                  value={formData.preferredTone}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      preferredTone: value as TonePreference,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minCpm">Minimum CPM ($)</Label>
              <Input
                id="minCpm"
                type="number"
                step="0.01"
                placeholder="Leave empty for no minimum"
                value={formData.minCpm}
                onChange={(e) =>
                  setFormData({ ...formData, minCpm: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Only show ads with a CPM at or above this amount.
              </p>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </form>
    </div>
  );
}
