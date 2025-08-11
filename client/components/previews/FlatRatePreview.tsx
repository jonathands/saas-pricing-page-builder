import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { FeatureDisplay } from "@/components/FeatureDisplay";
import { FlatRateStrategy } from "@shared/pricing";

interface FlatRatePreviewProps {
  strategy: FlatRateStrategy;
}

export function FlatRatePreview({ strategy }: FlatRatePreviewProps) {
  const { theme } = useTheme();
  return (
    <Card className="max-w-md" style={{ borderColor: theme.secondaryColor }}>
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
            ${strategy.price}
          </div>
          <div 
            style={{
              fontFamily: `var(--font-text, ${theme.textFont})`,
              color: 'hsl(var(--muted-foreground))'
            }}
          >
            per {strategy.billingPeriod === "monthly" ? "month" : "year"}
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
              <div 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: theme.primaryColor }}
              />
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
  );
}
