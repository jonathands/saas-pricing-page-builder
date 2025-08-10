import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { UsageBasedStrategy } from "@shared/pricing";

interface UsageBasedPreviewProps {
  strategy: UsageBasedStrategy;
}

export function UsageBasedPreview({ strategy }: UsageBasedPreviewProps) {
  const { theme } = useTheme();
  const sampleUsages = [100, 500, 1000, 2500, 5000];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card style={{ borderColor: theme.secondaryColor }}>
        <CardHeader className="text-center">
          <CardTitle style={{ fontFamily: `var(--font-header, ${theme.headerFont})` }}>
            {strategy.name}
          </CardTitle>
          <div className="space-y-1">
            <div 
              className="text-3xl font-bold"
              style={{ 
                fontFamily: `var(--font-header, ${theme.headerFont})`,
                color: theme.primaryColor
              }}
            >
              ${strategy.basePrice}
            </div>
            <div 
              style={{
                fontFamily: `var(--font-text, ${theme.textFont})`,
                color: 'hsl(var(--muted-foreground))'
              }}
            >
              base + ${strategy.usagePrice} per {strategy.usageUnit}
            </div>
            <div 
              className="text-sm"
              style={{
                fontFamily: `var(--font-text, ${theme.textFont})`,
                color: 'hsl(var(--muted-foreground))'
              }}
            >
              Includes {strategy.includedUsage} {strategy.usageUnit}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {strategy.features.map((feature, index) => (
              <li 
                key={index} 
                className="flex items-center gap-2"
                style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
              >
                <CheckCircle className="w-4 h-4" style={{ color: theme.primaryColor }} />
                {feature}
              </li>
            ))}
          </ul>
          <Button 
            className="w-full"
            style={{ 
              fontFamily: `var(--font-button, ${theme.buttonFont})`,
              backgroundColor: theme.primaryColor,
              borderColor: theme.primaryColor
            }}
          >
            Get Started
          </Button>
        </CardContent>
      </Card>

      <Card style={{ borderColor: theme.secondaryColor }}>
        <CardHeader>
          <CardTitle 
            className="text-lg"
            style={{ fontFamily: `var(--font-header, ${theme.headerFont})` }}
          >
            Usage Examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sampleUsages.map((usage) => {
              const overage = Math.max(0, usage - strategy.includedUsage);
              const totalCost =
                strategy.basePrice + overage * strategy.usagePrice;
              return (
                <div 
                  key={usage} 
                  className="flex justify-between text-sm"
                  style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
                >
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