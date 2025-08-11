import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/contexts/ThemeContext";
import { ComparisonTable, CostChart } from "@/components/ComparisonComponents";
import { FlatRatePreview } from "./previews/FlatRatePreview";
import { TieredPreview } from "./previews/TieredPreview";
import { UsageBasedPreview } from "./previews/UsageBasedPreview";
import { PerUserPreview } from "./previews/PerUserPreview";
import { FreemiumPreview } from "./previews/FreemiumPreview";
import { FeatureBasedPreview } from "./FeatureBasedPreview";
import {
  PricingStrategy,
  STRATEGY_LABELS,
  FlatRateStrategy,
  TieredStrategy,
  UsageBasedStrategy,
  PerUserStrategy,
  FreemiumStrategy,
  FeatureBasedStrategy,
} from "@shared/pricing";

interface PricingPreviewProps {
  strategies: PricingStrategy[];
  comparisonMode: boolean;
}

export function PricingPreview({
  strategies,
  comparisonMode,
}: PricingPreviewProps) {
  const { theme } = useTheme();

  if (strategies.length === 0) {
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
              color: theme.primaryColor
            }}
          >
            No Pricing Strategies Yet
          </h3>
          <p
            className="text-muted-foreground"
            style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
          >
            Add pricing strategies from the sidebar to see your live pricing page.
            Customize themes and see real-time updates.
          </p>
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
            color: theme.primaryColor
          }}
        >
          Choose Your Plan
        </h2>
        <p
          className="text-sm lg:text-base"
          style={{
            fontFamily: `var(--font-text, ${theme.textFont})`,
            color: 'hsl(var(--muted-foreground))'
          }}
        >
          Select the perfect plan for your needs
        </p>
      </div>

      {/* Strategy Display */}
      <div className="space-y-6 lg:space-y-8">
        {strategies.map((strategy) => (
          <div key={strategy.id} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3
                className="text-lg lg:text-xl font-semibold"
                style={{
                  fontFamily: `var(--font-header, ${theme.headerFont})`,
                  color: theme.primaryColor
                }}
              >
                {strategy.name}
              </h3>
              <Badge
                variant="outline"
                className="w-fit"
                style={{
                  borderColor: theme.primaryColor,
                  color: theme.primaryColor,
                  fontFamily: `var(--font-text, ${theme.textFont})`
                }}
              >
                {STRATEGY_LABELS[strategy.type]}
              </Badge>
            </div>

            <div className="w-full overflow-x-auto">
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

              {strategy.type === "freemium" && (
                <FreemiumPreview strategy={strategy as FreemiumStrategy} />
              )}

              {strategy.type === "feature-based" && (
                <FeatureBasedPreview strategy={strategy as FeatureBasedStrategy} />
              )}
            </div>

            {strategies.length > 1 && <Separator />}
          </div>
        ))}
      </div>

      {/* Comparison Section */}
      {comparisonMode && strategies.length > 1 && (
        <div className="space-y-6 lg:space-y-8 pt-6 lg:pt-8 border-t">
          <div className="text-center space-y-2">
            <h2
              className="text-xl lg:text-2xl font-bold"
              style={{
                fontFamily: `var(--font-header, ${theme.headerFont})`,
                color: theme.primaryColor
              }}
            >
              Strategy Comparison
            </h2>
            <p
              className="text-sm lg:text-base"
              style={{
                fontFamily: `var(--font-text, ${theme.textFont})`,
                color: 'hsl(var(--muted-foreground))'
              }}
            >
              Compare your pricing strategies side by side
            </p>
          </div>

          <div className="space-y-6">
            <div className="overflow-x-auto">
              <ComparisonTable strategies={strategies} />
            </div>

            <div className="w-full">
              <h3
                className="text-lg font-semibold mb-4"
                style={{
                  fontFamily: `var(--font-header, ${theme.headerFont})`,
                  color: theme.primaryColor
                }}
              >
                Cost Analysis
              </h3>
              <CostChart strategies={strategies} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
