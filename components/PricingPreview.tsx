"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ComparisonTable, CostChart } from "@/components/ComparisonComponents";
import { FlatRatePreview } from "./previews/FlatRatePreview";
import { TieredPreview } from "./previews/TieredPreview";
import { UsageBasedPreview } from "./previews/UsageBasedPreview";
import { PerUserPreview } from "./previews/PerUserPreview";
import { FreemiumPreview } from "./previews/FreemiumPreview";
import { FeatureBasedPreview } from "./FeatureBasedPreview";
import {
  PricingModel,
  MODEL_LABELS,
  FlatRateModel,
  TieredModel,
  UsageBasedModel,
  PerUserModel,
  FreemiumModel,
  FeatureBasedModel,
} from "@shared/pricing";

interface PricingPreviewProps {
  models: PricingModel[];
  onAddModel?: () => void;
}

export function PricingPreview({
  models,
  onAddModel,
}: PricingPreviewProps) {
  const { theme } = useTheme();

  if (models.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-center">
        <div className="space-y-4 max-w-md mx-auto">
          <div
            className="text-6xl opacity-20"
            style={{ color: theme.primaryColor }}
          >
            💰
          </div>
          <h3
            className="text-xl font-semibold"
            style={{
              fontFamily: `var(--font-header, ${theme.headerFont})`,
              color: theme.primaryColor,
            }}
          >
            No Pricing Models Yet
          </h3>
          <p
            className="text-muted-foreground mb-6"
            style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
          >
            Add pricing models from the sidebar to see your live pricing
            page. Customize themes and see real-time updates.
          </p>
          {onAddModel && (
            <Button
              onClick={onAddModel}
              className="bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Model
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      <div className="text-center space-y-2">
        <h2
          className="text-2xl lg:text-3xl font-bold"
          style={{
            fontFamily: `var(--font-header, ${theme.headerFont})`,
            color: theme.primaryColor,
          }}
        >
          Choose Your Plan
        </h2>
        <p
          className="text-sm lg:text-base"
          style={{
            fontFamily: `var(--font-text, ${theme.textFont})`,
            color: "hsl(var(--muted-foreground))",
          }}
        >
          Select the perfect plan for your needs
        </p>
      </div>

      {/* Model Display */}
      <div className="space-y-6 lg:space-y-8">
        {models.map((model) => (
          <div key={model.id} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3
                className="text-lg lg:text-xl font-semibold"
                style={{
                  fontFamily: `var(--font-header, ${theme.headerFont})`,
                  color: theme.primaryColor,
                }}
              >
                {model.name}
              </h3>
              <Badge
                variant="outline"
                className="w-fit"
                style={{
                  borderColor: theme.primaryColor,
                  color: theme.primaryColor,
                  fontFamily: `var(--font-text, ${theme.textFont})`,
                }}
              >
                {MODEL_LABELS[model.type]}
              </Badge>
            </div>

            <div className="w-full overflow-x-auto">
              {model.type === "flat-rate" && (
                <FlatRatePreview strategy={model as FlatRateModel} />
              )}

              {model.type === "tiered" && (
                <TieredPreview strategy={model as TieredModel} />
              )}

              {model.type === "usage-based" && (
                <UsageBasedPreview strategy={model as UsageBasedModel} />
              )}

              {model.type === "per-user" && (
                <PerUserPreview strategy={model as PerUserModel} />
              )}

              {model.type === "freemium" && (
                <FreemiumPreview strategy={model as FreemiumModel} />
              )}

              {model.type === "feature-based" && (
                <FeatureBasedPreview
                  strategy={model as FeatureBasedModel}
                />
              )}
            </div>

            {models.length > 1 && <Separator />}
          </div>
        ))}
      </div>

      {/* Comparison Section - Removed since comparison is now at top of canvas */}
      {false && models.length > 1 && (
        <div className="space-y-6 lg:space-y-8 pt-6 lg:pt-8 border-t">
          <div className="text-center space-y-2">
            <h2
              className="text-xl lg:text-2xl font-bold"
              style={{
                fontFamily: `var(--font-header, ${theme.headerFont})`,
                color: theme.primaryColor,
              }}
            >
              Model Comparison
            </h2>
            <p
              className="text-sm lg:text-base"
              style={{
                fontFamily: `var(--font-text, ${theme.textFont})`,
                color: "hsl(var(--muted-foreground))",
              }}
            >
              Compare your pricing models side by side
            </p>
          </div>

          <div className="space-y-6">
            <div className="overflow-x-auto">
              <ComparisonTable strategies={models} />
            </div>

            <div className="w-full">
              <h3
                className="text-lg font-semibold mb-4"
                style={{
                  fontFamily: `var(--font-header, ${theme.headerFont})`,
                  color: theme.primaryColor,
                }}
              >
                Cost Analysis
              </h3>
              <CostChart strategies={models} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
