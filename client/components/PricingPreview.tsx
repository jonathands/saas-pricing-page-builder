import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/contexts/ThemeContext";
import { FlatRatePreview } from "./previews/FlatRatePreview";
import { TieredPreview } from "./previews/TieredPreview";
import { UsageBasedPreview } from "./previews/UsageBasedPreview";
import { PerUserPreview } from "./previews/PerUserPreview";
import { FeatureBasedPreview } from "./FeatureBasedPreview";
import {
  PricingStrategy,
  STRATEGY_LABELS,
  FlatRateStrategy,
  TieredStrategy,
  UsageBasedStrategy,
  PerUserStrategy,
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
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 
          className="text-3xl font-bold"
          style={{ 
            fontFamily: `var(--font-header, ${theme.headerFont})`,
            color: theme.primaryColor
          }}
        >
          Choose Your Plan
        </h2>
        <p 
          style={{
            fontFamily: `var(--font-text, ${theme.textFont})`,
            color: 'hsl(var(--muted-foreground))'
          }}
        >
          Select the perfect plan for your needs
        </p>
      </div>

      {strategies.map((strategy) => (
        <div key={strategy.id} className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 
              className="text-lg font-semibold"
              style={{ 
                fontFamily: `var(--font-header, ${theme.headerFont})`,
                color: theme.primaryColor
              }}
            >
              {strategy.name}
            </h3>
            <Badge 
              variant="outline"
              style={{ 
                borderColor: theme.primaryColor,
                color: theme.primaryColor,
                fontFamily: `var(--font-text, ${theme.textFont})`
              }}
            >
              {STRATEGY_LABELS[strategy.type]}
            </Badge>
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

          {strategy.type === "feature-based" && (
            <FeatureBasedPreview strategy={strategy as FeatureBasedStrategy} />
          )}

          <Separator />
        </div>
      ))}
    </div>
  );
}