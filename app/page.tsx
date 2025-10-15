"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from "lucide-react";
import { ComparisonTable, CostChart } from "@/components/ComparisonComponents";
import { PricingPagePreviewModal } from "@/components/PricingPagePreviewModal";
import { ComparisonModal } from "@/components/ComparisonModal";
import { ThemeSettings } from "@/components/ThemeSettings";
import { ResizableSidebar } from "@/components/ResizableSidebar";
import { ThemedPricingPage } from "@/components/ThemedPricingPage";
import { ModelList } from "@/components/StrategyList";
import { PricingPreview } from "@/components/PricingPreview";
import { AddModelModal } from "@/components/AddStrategyModal";
import { GuidedTour } from "@/components/GuidedTour";
import {
  PricingModel,
  PricingModelType,
  MODEL_LABELS,
  MODEL_DESCRIPTIONS,
} from "@shared/pricing";

// Sample preset data
const SAMPLE_PRESETS: Record<PricingModelType, PricingModel> = {
  "flat-rate": {
    id: "flat-1",
    type: "flat-rate" as const,
    name: "Simple SaaS",
    description: "Perfect for straightforward SaaS products",
    price: 49,
    features: [
      {
        id: "1",
        text: "Unlimited projects",
        icon: "Package",
        iconPosition: "before",
      },
      {
        id: "2",
        text: "24/7 support",
        icon: "Headphones",
        iconPosition: "before",
      },
      { id: "3", text: "API access", icon: "Settings", iconPosition: "before" },
      {
        id: "4",
        text: "Advanced analytics",
        icon: "BarChart3",
        iconPosition: "before",
      },
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
      {
        id: "1",
        text: "Base platform access",
        icon: "Cloud",
        iconPosition: "before",
      },
      {
        id: "2",
        text: "Real-time monitoring",
        icon: "BarChart3",
        iconPosition: "before",
      },
      {
        id: "3",
        text: "Usage analytics",
        icon: "Clock",
        iconPosition: "before",
      },
      {
        id: "4",
        text: "API documentation",
        icon: "FileText",
        iconPosition: "before",
      },
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
        features: [
          {
            id: "1",
            text: "5 projects",
            icon: "Package",
            iconPosition: "before",
          },
          {
            id: "2",
            text: "Basic support",
            icon: "Mail",
            iconPosition: "before",
          },
          {
            id: "3",
            text: "Core features",
            icon: "Star",
            iconPosition: "before",
          },
        ],
        billingPeriod: "monthly" as const,
      },
      {
        id: "pro",
        name: "Pro",
        price: 49,
        features: [
          {
            id: "1",
            text: "25 projects",
            icon: "Package",
            iconPosition: "before",
          },
          {
            id: "2",
            text: "Priority support",
            icon: "Headphones",
            iconPosition: "before",
          },
          {
            id: "3",
            text: "Advanced features",
            icon: "Zap",
            iconPosition: "before",
          },
          {
            id: "4",
            text: "API access",
            icon: "Settings",
            iconPosition: "before",
          },
        ],
        billingPeriod: "monthly" as const,
        popular: true,
      },
      {
        id: "enterprise",
        name: "Enterprise",
        price: 149,
        features: [
          {
            id: "1",
            text: "Unlimited projects",
            icon: "Package",
            iconPosition: "before",
          },
          {
            id: "2",
            text: "Dedicated support",
            icon: "Shield",
            iconPosition: "before",
          },
          {
            id: "3",
            text: "Custom integrations",
            icon: "Globe",
            iconPosition: "before",
          },
          {
            id: "4",
            text: "SLA guarantee",
            icon: "Award",
            iconPosition: "before",
          },
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
      {
        id: "1",
        text: "Per-user workspaces",
        icon: "Users",
        iconPosition: "before",
      },
      {
        id: "2",
        text: "Team collaboration",
        icon: "Users",
        iconPosition: "before",
      },
      {
        id: "3",
        text: "Admin controls",
        icon: "Shield",
        iconPosition: "before",
      },
      {
        id: "4",
        text: "Usage insights",
        icon: "BarChart3",
        iconPosition: "before",
      },
    ],
    billingPeriod: "monthly" as const,
  },
  freemium: {
    id: "freemium-1",
    type: "freemium" as const,
    name: "Freemium Growth",
    description: "Free tier with premium upgrades",
    freeTier: {
      features: [
        { id: "1", text: "1 project", icon: "Package", iconPosition: "before" },
        {
          id: "2",
          text: "Basic features",
          icon: "Star",
          iconPosition: "before",
        },
        {
          id: "3",
          text: "Community support",
          icon: "Users",
          iconPosition: "before",
        },
      ],
      usageLimit: 100,
    },
    paidTiers: [
      {
        id: "starter",
        name: "Starter",
        price: 9,
        features: [
          {
            id: "1",
            text: "5 projects",
            icon: "Package",
            iconPosition: "before",
          },
          {
            id: "2",
            text: "Premium features",
            icon: "Zap",
            iconPosition: "before",
          },
          {
            id: "3",
            text: "Email support",
            icon: "Mail",
            iconPosition: "before",
          },
        ],
        usageLimit: 1000,
        billingPeriod: "monthly" as const,
      },
      {
        id: "professional",
        name: "Professional",
        price: 29,
        features: [
          {
            id: "1",
            text: "Unlimited projects",
            icon: "Package",
            iconPosition: "before",
          },
          {
            id: "2",
            text: "All features",
            icon: "Star",
            iconPosition: "before",
          },
          {
            id: "3",
            text: "Priority support",
            icon: "Headphones",
            iconPosition: "before",
          },
        ],
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

export default function Page() {
  const [models, setModels] = useState<PricingModel[]>([]);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [addModelModalOpen, setAddModelModalOpen] = useState(false);
  const [configureModelsCollapsed, setConfigureModelsCollapsed] = useState(true);
  const [comparisonCollapsed, setComparisonCollapsed] = useState(true);
  const [editingModel, setEditingModel] = useState<PricingModel | null>(null);
  const [showTour, setShowTour] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  // Show tour for new users
  useEffect(() => {
    const tourSeen = localStorage.getItem("pricingcraft-tour-seen");
    if (!tourSeen && models.length === 0) {
      setHasSeenTour(false);
      // Show tour after a brief delay
      setTimeout(() => setShowTour(true), 1000);
    } else {
      setHasSeenTour(true);
    }
  }, [models.length]);

  const addModel = useCallback(
    (type: PricingModelType) => {
      const preset = SAMPLE_PRESETS[type];
      const newModel = {
        ...preset,
        id: `${type}-${Date.now()}`,
        name: `${preset.name} ${models.filter((s) => s.type === type).length + 1}`,
      };
      setModels((prev) => [...prev, newModel as PricingModel]);
    },
    [models]
  );

  const addModelFromModal = useCallback(
    (model: PricingModel) => {
      setModels((prev) => [...prev, model]);
    },
    []
  );

  const updateModel = useCallback(
    (id: string, updates: Partial<PricingModel>) => {
      setModels((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
      );
    },
    []
  );

  const removeModel = useCallback((id: string) => {
    setModels((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleEditModel = useCallback((model: PricingModel) => {
    setEditingModel(model);
    setAddModelModalOpen(true);
  }, []);

  const handleUpdateModel = useCallback((model: PricingModel) => {
    setModels((prev) => prev.map((s) => (s.id === model.id ? model : s)));
    setEditingModel(null);
  }, []);

  const handleModalClose = useCallback(() => {
    setAddModelModalOpen(false);
    setEditingModel(null);
  }, []);

  const handleTourComplete = useCallback(() => {
    setShowTour(false);
    setHasSeenTour(true);
    localStorage.setItem("pricingcraft-tour-seen", "true");
  }, []);

  const startTour = useCallback(() => {
    setShowTour(true);
  }, []);

  const exportConfiguration = useCallback(() => {
    const config = { models };
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pricing-models.json";
    link.click();
    URL.revokeObjectURL(url);
  }, [models]);


  return (
    <div className="min-h-screen bg-background">
        {/* Header */}
        <header
          className="border-b border-slate-700 bg-slate-900 sticky top-0 z-50"
          style={{ fontFamily: "\"Open Sans\", sans-serif" }}
        >
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-slate-100">
                    PricingCraft
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 hidden sm:block">
                    SaaS Pricing Model Builder
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setComparisonModalOpen(true)}
                  className="border-slate-600 text-slate-900 hover:bg-slate-800 hover:text-slate-200 hidden sm:flex"
                  disabled={models.length < 2}
                  data-tour="comparison-button"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Compare Models</span>
                  <span className="md:hidden">Compare</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewModalOpen(true)}
                  className="border-slate-600 text-slate-900 hover:bg-slate-800 hover:text-slate-200"
                  data-tour="preview-button"
                >
                  <Monitor className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Preview Page</span>
                </Button>
                <Button
                  onClick={exportConfiguration}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  data-tour="export-button"
                >
                  <Download className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
                {hasSeenTour && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={startTour}
                    className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    title="Start guided tour"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                )}
                <ThemeSettings />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] mobile-stack">
          <ResizableSidebar className="sidebar-mobile">
            {/* Left Sidebar - Model Builder */}
            <div className="p-4 lg:p-6 bg-slate-900 min-h-full lg:h-[calc(100vh-80px)] overflow-y-auto space-y-4 lg:space-y-6">
              {/* Add Model Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-100">
                  Add Pricing Model
                </h2>
                <Button
                  onClick={() => setAddModelModalOpen(true)}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  data-tour="add-model-button"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Pricing Model
                </Button>
                <p className="text-sm text-slate-400">
                  Choose from multiple pricing models including tiered, usage-based, freemium, and more.
                </p>
              </div>

              {/* Model List */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-100">
                  Your Pricing Models
                </h2>
                <ModelList
                  models={models}
                  onEdit={handleEditModel}
                  onRemove={removeModel}
                />
              </div>

            </div>
          </ResizableSidebar>

          {/* Right Side - Preview */}
          <div className="flex-1 bg-background lg:min-h-0 min-h-[50vh] preview-mobile">
            <ThemedPricingPage className="h-full">
              <div className="h-full overflow-y-auto p-4 lg:p-8 space-y-6" data-tour="canvas">
                {/* Comparison Analysis at Top of Canvas */}
                {models.length > 1 && (
                  <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
                    <button
                      onClick={() => setComparisonCollapsed(!comparisonCollapsed)}
                      className="flex items-center justify-between w-full text-left group mb-4"
                    >
                      <h2 className="text-lg lg:text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        Comparison Analysis
                      </h2>
                      <div className="text-muted-foreground group-hover:text-primary transition-colors">
                        {comparisonCollapsed ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronUp className="w-5 h-5" />
                        )}
                      </div>
                    </button>
                    {!comparisonCollapsed && (
                      <div className="space-y-6">
                        <div className="overflow-x-auto">
                          <ComparisonTable strategies={models} />
                        </div>
                        <div className="w-full">
                          <h3 className="text-lg font-semibold mb-4 text-foreground">
                            Cost Analysis
                          </h3>
                          <CostChart strategies={models} />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <PricingPreview
                  models={models}
                  onAddModel={() => setAddModelModalOpen(true)}
                />
              </div>
            </ThemedPricingPage>
          </div>
        </div>

        {/* Preview Modal */}
        <PricingPagePreviewModal
          isOpen={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          strategies={models}
        />

        <ComparisonModal
          isOpen={comparisonModalOpen}
          onClose={() => setComparisonModalOpen(false)}
          strategies={models}
        />

        <AddModelModal
          isOpen={addModelModalOpen}
          onClose={handleModalClose}
          onAddModel={addModelFromModal}
          onUpdateModel={handleUpdateModel}
          editingModel={editingModel}
        />

        <GuidedTour
          isOpen={showTour}
          onClose={() => setShowTour(false)}
          onComplete={handleTourComplete}
        />
    </div>
  );
}
