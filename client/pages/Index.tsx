import { useState, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Plus,
  Trash2,
  Eye,
  BarChart3,
  Zap,
  Users,
  Star,
  Package,
  Settings,
  CheckCircle,
  CreditCard,
  Monitor,
} from "lucide-react";
import { ComparisonTable, CostChart } from "@/components/ComparisonComponents";
import { PricingPagePreviewModal } from "@/components/PricingPagePreviewModal";
import { ThemeSettings } from "@/components/ThemeSettings";
import { ResizableSidebar } from "@/components/ResizableSidebar";
import { ThemedPricingPage } from "@/components/ThemedPricingPage";
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1
                  className="text-xl font-bold text-foreground"
                  style={{
                    fontFamily: `var(--font-header, ${theme.headerFont})`,
                  }}
                >
                  PricingCraft
                </h1>
                <p
                  className="text-sm text-muted-foreground"
                  style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
                >
                  SaaS Pricing Strategy Builder
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="comparison-mode" className="text-sm">
                  Comparison
                </Label>
                <Switch
                  id="comparison-mode"
                  checked={comparisonMode}
                  onCheckedChange={setComparisonMode}
                />
              </div>
              <Button
                onClick={() => setPreviewModalOpen(true)}
                variant="outline"
                size="sm"
                disabled={strategies.length === 0}
              >
                <Monitor className="w-4 h-4 mr-2" />
                Preview Page
              </Button>
              <Button onClick={exportConfiguration} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout with Resizable Sidebar */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Resizable Sidebar - Builder Area */}
        <ResizableSidebar defaultWidth={450} minWidth={320} maxWidth={800}>
          <div className="h-full overflow-y-auto p-6 space-y-6 bg-slate-900 text-slate-100">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <Plus className="w-5 h-5" />
                  Add Pricing Strategy
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Choose a pricing strategy to configure and preview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">Strategy Type</Label>
                  <Select
                    value={selectedStrategyType}
                    onValueChange={(value: PricingStrategyType) =>
                      setSelectedStrategyType(value)
                    }
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {Object.entries(STRATEGY_LABELS).map(([type, label]) => {
                        const Icon = getStrategyIcon(
                          type as PricingStrategyType,
                        );
                        return (
                          <SelectItem key={type} value={type} className="text-slate-100 focus:bg-slate-700">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-slate-400">
                    {STRATEGY_DESCRIPTIONS[selectedStrategyType]}
                  </p>
                </div>
                <Button
                  onClick={() => addStrategy(selectedStrategyType)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add {STRATEGY_LABELS[selectedStrategyType]}
                </Button>
              </CardContent>
            </Card>

            {/* Strategy Configuration */}
            <div className="space-y-4">
              {strategies.map((strategy) => (
                <StrategyConfigCard
                  key={strategy.id}
                  strategy={strategy}
                  onUpdate={updateStrategy}
                  onRemove={removeStrategy}
                />
              ))}
            </div>
          </div>
        </ResizableSidebar>

        {/* Main Content Area - Pricing Page Preview */}
        <div className="flex-1 overflow-hidden">
          <ThemedPricingPage className="h-full">
            <div className="h-full flex flex-col">
              {/* Preview Header */}
              <div className="bg-white/90 backdrop-blur-sm border-b px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Live Pricing Page</h2>
                    <p className="text-sm text-muted-foreground">
                      Real-time preview with your theme and strategies
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {strategies.length > 0 && comparisonMode && strategies.length > 1 && (
                      <Badge variant="secondary">Comparison Mode</Badge>
                    )}
                    <Badge variant="outline">
                      {strategies.length} strateg{strategies.length === 1 ? 'y' : 'ies'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-y-auto">
                {strategies.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <div className="space-y-4 max-w-md">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <BarChart3 className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          Design Your Pricing Strategy
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Add pricing strategies from the sidebar to see your live pricing page.
                          Customize themes and see real-time updates.
                        </p>
                        <Button
                          variant="outline"
                          disabled
                          className="glass-effect"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add strategies to get started
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <PricingPreview
                      strategies={strategies}
                      comparisonMode={comparisonMode}
                    />
                    {comparisonMode && strategies.length > 1 && (
                      <div className="mt-12 space-y-8">
                        <div>
                          <h3 className="text-2xl font-semibold mb-6">Strategy Comparison</h3>
                          <ComparisonTable strategies={strategies} />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold mb-6">Cost Analysis</h4>
                          <CostChart strategies={strategies} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </ThemedPricingPage>
        </div>
      </div>

      {/* Theme Settings */}
      <ThemeSettings />

      {/* Pricing Page Preview Modal */}
      <PricingPagePreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        strategies={strategies}
      />
    </div>
  );
}

function StrategyConfigCard({
  strategy,
  onUpdate,
  onRemove,
}: {
  strategy: PricingStrategy;
  onUpdate: (id: string, updates: Partial<PricingStrategy>) => void;
  onRemove: (id: string) => void;
}) {
  const Icon =
    strategy.type === "flat-rate"
      ? Package
      : strategy.type === "usage-based"
        ? BarChart3
        : strategy.type === "tiered"
          ? Star
          : strategy.type === "per-user"
            ? Users
            : strategy.type === "freemium"
              ? Zap
              : Settings;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-slate-300" />
            <CardTitle className="text-lg text-slate-100">{strategy.name}</CardTitle>
            <Badge variant="secondary" className="bg-slate-700 text-slate-200 border-slate-600">
              {STRATEGY_LABELS[strategy.type]}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(strategy.id)}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <StrategyForm strategy={strategy} onUpdate={onUpdate} />
      </CardContent>
    </Card>
  );
}

function StrategyForm({
  strategy,
  onUpdate,
}: {
  strategy: PricingStrategy;
  onUpdate: (id: string, updates: Partial<PricingStrategy>) => void;
}) {
  const updateField = (field: string, value: any) => {
    onUpdate(strategy.id, { [field]: value });
  };

  const updateNestedField = (
    parentField: string,
    field: string,
    value: any,
  ) => {
    const parent = (strategy as any)[parentField];
    onUpdate(strategy.id, {
      [parentField]: { ...parent, [field]: value },
    });
  };

  if (strategy.type === "flat-rate") {
    const flatStrategy = strategy as FlatRateStrategy;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-200">Price ($)</Label>
            <Input
              type="number"
              value={flatStrategy.price}
              onChange={(e) => updateField("price", Number(e.target.value))}
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
          </div>
          <div>
            <Label className="text-slate-200">Billing Period</Label>
            <Select
              value={flatStrategy.billingPeriod}
              onValueChange={(value) => updateField("billingPeriod", value)}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="monthly" className="text-slate-100 focus:bg-slate-700">Monthly</SelectItem>
                <SelectItem value="yearly" className="text-slate-100 focus:bg-slate-700">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-slate-200">Features (one per line)</Label>
          <Textarea
            value={flatStrategy.features.join("\n")}
            onChange={(e) =>
              updateField(
                "features",
                e.target.value.split("\n").filter((f) => f.trim()),
              )
            }
            rows={4}
            className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
          />
        </div>
      </div>
    );
  }

  if (strategy.type === "tiered") {
    const tieredStrategy = strategy as TieredStrategy;
    return (
      <div className="space-y-4">
        <div className="text-sm font-medium text-slate-200">Tiers Configuration</div>
        {tieredStrategy.tiers.map((tier, index) => (
          <Card key={tier.id} className="p-4 bg-slate-700 border-slate-600">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-slate-200">Tier Name</Label>
                  <Input
                    value={tier.name}
                    onChange={(e) => {
                      const newTiers = [...tieredStrategy.tiers];
                      newTiers[index] = { ...tier, name: e.target.value };
                      updateField("tiers", newTiers);
                    }}
                    className="bg-slate-600 border-slate-500 text-slate-100"
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Price ($)</Label>
                  <Input
                    type="number"
                    value={tier.price}
                    onChange={(e) => {
                      const newTiers = [...tieredStrategy.tiers];
                      newTiers[index] = {
                        ...tier,
                        price: Number(e.target.value),
                      };
                      updateField("tiers", newTiers);
                    }}
                    className="bg-slate-600 border-slate-500 text-slate-100"
                  />
                </div>
              </div>
              <div>
                <Label className="text-slate-200">Features (one per line)</Label>
                <Textarea
                  value={tier.features.join("\n")}
                  onChange={(e) => {
                    const newTiers = [...tieredStrategy.tiers];
                    newTiers[index] = {
                      ...tier,
                      features: e.target.value
                        .split("\n")
                        .filter((f) => f.trim()),
                    };
                    updateField("tiers", newTiers);
                  }}
                  rows={3}
                  className="bg-slate-600 border-slate-500 text-slate-100 placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={tier.popular || false}
                  onCheckedChange={(checked) => {
                    const newTiers = [...tieredStrategy.tiers];
                    newTiers[index] = { ...tier, popular: checked };
                    updateField("tiers", newTiers);
                  }}
                />
                <Label className="text-slate-200">Mark as popular</Label>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (strategy.type === "usage-based") {
    const usageStrategy = strategy as UsageBasedStrategy;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-200">Base Price ($)</Label>
            <Input
              type="number"
              value={usageStrategy.basePrice}
              onChange={(e) => updateField("basePrice", Number(e.target.value))}
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
          </div>
          <div>
            <Label className="text-slate-200">Usage Price ($)</Label>
            <Input
              type="number"
              step="0.01"
              value={usageStrategy.usagePrice}
              onChange={(e) =>
                updateField("usagePrice", Number(e.target.value))
              }
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-200">Usage Unit</Label>
            <Input
              value={usageStrategy.usageUnit}
              onChange={(e) => updateField("usageUnit", e.target.value)}
              placeholder="e.g., API calls"
              className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
            />
          </div>
          <div>
            <Label className="text-slate-200">Included Usage</Label>
            <Input
              type="number"
              value={usageStrategy.includedUsage}
              onChange={(e) =>
                updateField("includedUsage", Number(e.target.value))
              }
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
          </div>
        </div>
        <div>
          <Label className="text-slate-200">Features (one per line)</Label>
          <Textarea
            value={usageStrategy.features.join("\n")}
            onChange={(e) =>
              updateField(
                "features",
                e.target.value.split("\n").filter((f) => f.trim()),
              )
            }
            rows={4}
            className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
          />
        </div>
      </div>
    );
  }

  if (strategy.type === "per-user") {
    const userStrategy = strategy as PerUserStrategy;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Price Per User ($)</Label>
            <Input
              type="number"
              value={userStrategy.pricePerUser}
              onChange={(e) =>
                updateField("pricePerUser", Number(e.target.value))
              }
            />
          </div>
          <div>
            <Label>Minimum Users</Label>
            <Input
              type="number"
              value={userStrategy.minimumUsers}
              onChange={(e) =>
                updateField("minimumUsers", Number(e.target.value))
              }
            />
          </div>
        </div>
        <div>
          <Label>Billing Period</Label>
          <Select
            value={userStrategy.billingPeriod}
            onValueChange={(value) => updateField("billingPeriod", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Features (one per line)</Label>
          <Textarea
            value={userStrategy.features.join("\n")}
            onChange={(e) =>
              updateField(
                "features",
                e.target.value.split("\n").filter((f) => f.trim()),
              )
            }
            rows={4}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 text-center text-muted-foreground">
      Configuration form for {strategy.type} coming soon...
    </div>
  );
}

function PricingPreview({
  strategies,
  comparisonMode,
}: {
  strategies: PricingStrategy[];
  comparisonMode: boolean;
}) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground">
          Select the perfect plan for your needs
        </p>
      </div>

      {strategies.map((strategy) => (
        <div key={strategy.id} className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{strategy.name}</h3>
            <Badge variant="outline">{STRATEGY_LABELS[strategy.type]}</Badge>
          </div>

          {strategy.type === "flat-rate" && (
            <FlatRatePreview strategy={strategy as FlatRateStrategy} />
          )}

          {strategy.type === "tiered" && (
            <TieredPreview strategy={strategy as TieredStrategy} />
          )}

          {strategy.type === "usage-based" && (
            <UsageBasedPreview strategy={strategy as UsageBasedStrategy} />
          )}

          {strategy.type === "per-user" && (
            <PerUserPreview strategy={strategy as PerUserStrategy} />
          )}

          <Separator />
        </div>
      ))}
    </div>
  );
}

function FlatRatePreview({ strategy }: { strategy: FlatRateStrategy }) {
  return (
    <Card className="max-w-md">
      <CardHeader className="text-center">
        <CardTitle>{strategy.name}</CardTitle>
        <div className="space-y-1">
          <div className="text-3xl font-bold">${strategy.price}</div>
          <div className="text-muted-foreground">
            per {strategy.billingPeriod === "monthly" ? "month" : "year"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {strategy.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              {feature}
            </li>
          ))}
        </ul>
        <Button className="w-full">Get Started</Button>
      </CardContent>
    </Card>
  );
}

function TieredPreview({ strategy }: { strategy: TieredStrategy }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {strategy.tiers.map((tier) => (
        <Card
          key={tier.id}
          className={`relative ${tier.popular ? "ring-2 ring-primary" : ""}`}
        >
          {tier.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground">
                Most Popular
              </Badge>
            </div>
          )}
          <CardHeader className="text-center">
            <CardTitle>{tier.name}</CardTitle>
            <div className="space-y-1">
              <div className="text-3xl font-bold">${tier.price}</div>
              <div className="text-muted-foreground">
                per {tier.billingPeriod === "monthly" ? "month" : "year"}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              variant={tier.popular ? "default" : "outline"}
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function UsageBasedPreview({ strategy }: { strategy: UsageBasedStrategy }) {
  const sampleUsages = [100, 500, 1000, 2500, 5000];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>{strategy.name}</CardTitle>
          <div className="space-y-1">
            <div className="text-3xl font-bold">${strategy.basePrice}</div>
            <div className="text-muted-foreground">
              base + ${strategy.usagePrice} per {strategy.usageUnit}
            </div>
            <div className="text-sm text-muted-foreground">
              Includes {strategy.includedUsage} {strategy.usageUnit}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {strategy.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <Button className="w-full">Get Started</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usage Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sampleUsages.map((usage) => {
              const overage = Math.max(0, usage - strategy.includedUsage);
              const totalCost =
                strategy.basePrice + overage * strategy.usagePrice;
              return (
                <div key={usage} className="flex justify-between text-sm">
                  <span>
                    {usage.toLocaleString()} {strategy.usageUnit}
                  </span>
                  <span className="font-semibold">${totalCost.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PerUserPreview({ strategy }: { strategy: PerUserStrategy }) {
  const sampleUserCounts = [3, 5, 10, 25, 50];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>{strategy.name}</CardTitle>
          <div className="space-y-1">
            <div className="text-3xl font-bold">${strategy.pricePerUser}</div>
            <div className="text-muted-foreground">
              per user /{" "}
              {strategy.billingPeriod === "monthly" ? "month" : "year"}
            </div>
            <div className="text-sm text-muted-foreground">
              Minimum {strategy.minimumUsers} users
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {strategy.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <Button className="w-full">Get Started</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pricing Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sampleUserCounts.map((userCount) => {
              const effectiveUsers = Math.max(userCount, strategy.minimumUsers);
              const totalCost = effectiveUsers * strategy.pricePerUser;
              return (
                <div key={userCount} className="flex justify-between text-sm">
                  <span>{userCount} users</span>
                  <span className="font-semibold">${totalCost.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
