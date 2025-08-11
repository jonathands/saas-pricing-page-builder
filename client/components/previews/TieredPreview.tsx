import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { FeatureDisplay } from "@/components/FeatureDisplay";
import { TieredStrategy } from "@shared/pricing";

interface TieredPreviewProps {
  strategy: TieredStrategy;
}

export function TieredPreview({ strategy }: TieredPreviewProps) {
  const { theme } = useTheme();
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {strategy.tiers.map((tier) => (
        <Card
          key={tier.id}
          className="relative"
          style={{ 
            borderColor: tier.popular ? theme.primaryColor : theme.secondaryColor,
            borderWidth: tier.popular ? '2px' : '1px'
          }}
        >
          {tier.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge 
                style={{ 
                  backgroundColor: theme.primaryColor,
                  color: 'white',
                  fontFamily: `var(--font-text, ${theme.textFont})`
                }}
              >
                Most Popular
              </Badge>
            </div>
          )}
          <CardHeader className="text-center">
            <CardTitle style={{ fontFamily: `var(--font-header, ${theme.headerFont})` }}>
              {tier.name}
            </CardTitle>
            <div className="space-y-1">
              <div 
                className="text-3xl font-bold"
                style={{ 
                  fontFamily: `var(--font-header, ${theme.headerFont})`,
                  color: theme.primaryColor
                }}
              >
                ${tier.price}
              </div>
              <div 
                style={{
                  fontFamily: `var(--font-text, ${theme.textFont})`,
                  color: 'hsl(var(--muted-foreground))'
                }}
              >
                per {tier.billingPeriod === "monthly" ? "month" : "year"}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FeatureDisplay
              features={tier.features}
              iconColorClass="text-primary"
              style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
            />
            <Button
              className="w-full"
              variant={tier.popular ? "default" : "outline"}
              style={tier.popular ? {
                fontFamily: `var(--font-button, ${theme.buttonFont})`,
                backgroundColor: theme.primaryColor,
                borderColor: theme.primaryColor
              } : {
                fontFamily: `var(--font-button, ${theme.buttonFont})`,
                borderColor: theme.primaryColor,
                color: theme.primaryColor
              }}
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
