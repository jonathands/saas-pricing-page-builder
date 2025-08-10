import React, { useState, useCallback } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Plus,
  BarChart3,
  Zap,
  Users,
  Star,
  Package,
  Settings,
  Monitor,
} from "lucide-react";
import { ComparisonTable, CostChart } from "@/components/ComparisonComponents";
import { PricingPagePreviewModal } from "@/components/PricingPagePreviewModal";
import { ThemeSettings } from "@/components/ThemeSettings";
import { ResizableSidebar } from "@/components/ResizableSidebar";
import { ThemedPricingPage } from "@/components/ThemedPricingPage";
import { StrategyConfigCard } from "@/components/StrategyConfigCard";
import { PricingPreview } from "@/components/PricingPreview";
import { useTheme } from "@/contexts/ThemeContext";
import {
  PricingStrategy,
  PricingStrategyType,
  STRATEGY_LABELS,
  STRATEGY_DESCRIPTIONS,
  TieredStrategy,
  FlatRateStrategy,
  UsageBasedStrategy,
  PerUserStrategy,
  FreemiumStrategy,
  FeatureBasedStrategy,
} from "@shared/pricing";

// Sample preset data
const SAMPLE_PRESETS: Record<PricingStrategyType, any> = {
  "flat-rate": {
    id: "flat-1",
    type: "flat-rate" as const,
    name: "Simple SaaS",
    description: "Perfect for straightforward SaaS products",
    price: 49,
    features: [
      "Unlimited projects",
      "24/7 support",
      "API access",
      "Advanced analytics",
    ],
    billingPeriod: "monthly" as const,
  },
  "usage-based": {
    id: "usage-1",
    type: "usage-based" as const,
    name: "Pay as you Scale",
    description: "Perfect for APIs and scalable services",
    basePrice: 10,
    usagePrice: 0.05,
    usageUnit: "API calls",
    includedUsage: 1000,
    features: [
      "Base platform access",
      "Real-time monitoring",
      "Usage analytics",
      "API documentation",
    ],
  },
  tiered: {
    id: "tiered-1",
    type: "tiered" as const,
    name: "Growth Plans",
    description: "Multiple tiers for different customer segments",
    tiers: [
      {
        id: "basic",
        name: "Basic",
        price: 19,
        features: ["5 projects", "Basic support", "Core features"],
        billingPeriod: "monthly" as const,
      },
      {
        id: "pro",
        name: "Pro",
        price: 49,
        features: [
          "25 projects",
          "Priority support",
          "Advanced features",
          "API access",
        ],
        billingPeriod: "monthly" as const,
        popular: true,
      },
      {
        id: "enterprise",
        name: "Enterprise",
        price: 149,
        features: [
          "Unlimited projects",
          "Dedicated support",
          "Custom integrations",
          "SLA guarantee",
        ],
        billingPeriod: "monthly" as const,
      },
    ],
  },
  "per-user": {
    id: "user-1",
    type: "per-user" as const,
    name: "Team Collaboration",
    description: "Perfect for team-based SaaS products",
    pricePerUser: 15,
    minimumUsers: 3,
    features: [
      "Per-user workspaces",
      "Team collaboration",
      "Admin controls",
      "Usage insights",
    ],
    billingPeriod: "monthly" as const,
  },
  freemium: {
    id: "freemium-1",
    type: "freemium" as const,
    name: "Freemium Growth",
    description: "Free tier with premium upgrades",
    freeTier: {
      features: ["1 project", "Basic features", "Community support"],
      usageLimit: 100,
    },
    paidTiers: [
      {
        id: "starter",
        name: "Starter",
        price: 9,
        features: ["5 projects", "Premium features", "Email support"],
        usageLimit: 1000,
        billingPeriod: "monthly" as const,
      },
      {
        id: "professional",
        name: "Professional",
        price: 29,
        features: ["Unlimited projects", "All features", "Priority support"],
        billingPeriod: "monthly" as const,
      },
    ],
  },
  "feature-based": {
    id: "feature-1",
    type: "feature-based" as const,
    name: "Custom Bundle",
    description: "Pay only for the features you need",
    basePrice: 19,
    features: [
      {
        id: "analytics",
        name: "Advanced Analytics",
        price: 10,
        description: "Detailed reporting and insights",
      },
      {
        id: "api",
        name: "API Access",
        price: 15,
        description: "Full REST API access",
      },
      {
        id: "integrations",
        name: "Third-party Integrations",
        price: 20,
        description: "Connect with external tools",
      },
      {
        id: "whitelabel",
        name: "White-label",
        price: 50,
        description: "Remove branding and customize",
      },
    ],
    billingPeriod: "monthly" as const,
  },
};

export default function Index() {
  const { theme } = useTheme();
  const [strategies, setStrategies] = useState<PricingStrategy[]>([]);
  const [selectedStrategyType, setSelectedStrategyType] =
    useState<PricingStrategyType>("tiered");
  const [comparisonMode, setComparisonMode] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const addStrategy = useCallback(
    (type: PricingStrategyType) => {
      const preset = SAMPLE_PRESETS[type];
      const newStrategy = {
        ...preset,
        id: `${type}-${Date.now()}`,
        name: `${preset.name} ${strategies.filter((s) => s.type === type).length + 1}`,
      };
      // @ts-ignore
      setStrategies((prev) => [...prev, newStrategy]);
    },
    [strategies],
  );

  const updateStrategy = useCallback((id: string, updates: any) => {
    // @ts-ignore
    setStrategies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    );
  }, []);

  const removeStrategy = useCallback((id: string) => {
    setStrategies((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const exportConfiguration = useCallback(() => {
    const config = { strategies, comparisonMode };
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pricing-strategies.json";
    link.click();
    URL.revokeObjectURL(url);
  }, [strategies, comparisonMode]);

  const getStrategyIcon = (type: PricingStrategyType) => {
    const icons = {
      "flat-rate": Package,
      "usage-based": BarChart3,
      tiered: Star,
      "per-user": Users,
      freemium: Zap,
      "feature-based": Settings,
    };
    return icons[type];
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header
          className="border-b border-slate-700 bg-slate-900 sticky top-0 z-50"
          style={{ fontFamily: '"Open Sans", sans-serif' }}
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-100">
                    PricingCraft
                  </h1>
                  <p className="text-sm text-slate-300">
                    SaaS Pricing Strategy Builder
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="comparison-mode"
                    className="text-sm text-slate-200"
                  >
                    Comparison
                  </Label>
                  <Switch
                    id="comparison-mode"
                    checked={comparisonMode}
                    onCheckedChange={setComparisonMode}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewModalOpen(true)}
                  className="border-slate-600 text-slate-200 hover:bg-slate-800"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Preview Page
                </Button>
                <Button
                  onClick={exportConfiguration}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <ThemeSettings />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-80px)]">
          <ResizableSidebar>
            {/* Left Sidebar - Strategy Builder */}
            <div className="p-6 bg-slate-900 h-full overflow-y-auto space-y-6">
              {/* Add Strategy Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-100">
                  Add Pricing Strategy
                </h2>
                <div className="flex gap-3">
                  <Select
                    value={selectedStrategyType}
                    onValueChange={(value: PricingStrategyType) =>
                      setSelectedStrategyType(value)
                    }
                  >
                    <SelectTrigger className="flex-1 bg-slate-800 border-slate-700 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {(
                        Object.keys(STRATEGY_LABELS) as PricingStrategyType[]
                      ).map((type) => {
                        const Icon = getStrategyIcon(type);
                        return (
                          <SelectItem
                            key={type}
                            value={type}
                            className="text-slate-100 focus:bg-slate-700"
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {STRATEGY_LABELS[type]}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => addStrategy(selectedStrategyType)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-slate-400">
                  {STRATEGY_DESCRIPTIONS[selectedStrategyType]}
                </p>
              </div>

              {/* Strategy Cards */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-100">
                  Configure Strategies
                </h2>
                {strategies.length === 0 ? (
                  <div className="text-center py-8 bg-slate-800 rounded-lg border-2 border-dashed border-slate-600">
                    <Package className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-slate-400 mb-3">No strategies added</p>
                    <p className="text-sm text-slate-500">
                      Add your first pricing strategy to get started
                    </p>
                  </div>
                ) : (
                  strategies.map((strategy) => (
                    <StrategyConfigCard
                      key={strategy.id}
                      strategy={strategy}
                      onUpdate={updateStrategy}
                      onRemove={removeStrategy}
                    />
                  ))
                )}
              </div>

              {/* Comparison Tools */}
              {comparisonMode && strategies.length > 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-100">
                    Comparison Analysis
                  </h2>
                  <ComparisonTable strategies={strategies} />
                  <CostChart strategies={strategies} />
                </div>
              )}
            </div>
          </ResizableSidebar>

          {/* Right Side - Preview */}
          <div className="flex-1 bg-background">
            <ThemedPricingPage className="h-full overflow-y-auto p-8">
              <PricingPreview
                strategies={strategies}
                comparisonMode={comparisonMode}
              />
            </ThemedPricingPage>
          </div>
        </div>

        {/* Preview Modal */}
        <PricingPagePreviewModal
          isOpen={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          strategies={strategies}
          comparisonMode={comparisonMode}
        />
      </div>
    </ThemeProvider>
  );
}
