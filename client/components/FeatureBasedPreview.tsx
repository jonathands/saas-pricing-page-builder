import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus } from "lucide-react";
import { FeatureBasedStrategy } from "@shared/pricing";
import { useTheme } from "@/contexts/ThemeContext";

export function FeatureBasedPreview({
  strategy,
}: {
  strategy: FeatureBasedStrategy;
}) {
  const { theme } = useTheme();
  const mandatoryFeatures = strategy.features.filter((f: any) => f.mandatory);
  const optionalFeatures = strategy.features.filter((f: any) => !f.mandatory);
  const mandatoryTotal = mandatoryFeatures.reduce((sum, f) => sum + f.price, 0);
  const totalPrice = strategy.basePrice + mandatoryTotal;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="pricing-card" style={{ borderColor: theme.secondaryColor }}>
        <CardHeader className="text-center">
          <CardTitle style={{ fontFamily: `var(--font-header, ${theme.headerFont})` }}>
            {strategy.name}
          </CardTitle>
          <div className="space-y-1">
            <div 
              className="text-2xl font-bold"
              style={{ 
                fontFamily: `var(--font-header, ${theme.headerFont})`,
                color: theme.primaryColor
              }}
            >
              From ${totalPrice}
              <span 
                className="text-lg"
                style={{
                  fontFamily: `var(--font-text, ${theme.textFont})`,
                  color: 'hsl(var(--muted-foreground))'
                }}
              >
                /{strategy.billingPeriod === "monthly" ? "mo" : "yr"}
              </span>
            </div>
            <div 
              className="text-sm"
              style={{
                fontFamily: `var(--font-text, ${theme.textFont})`,
                color: 'hsl(var(--muted-foreground))'
              }}
            >
              Base price: ${strategy.basePrice}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Base Features */}
          <div>
            <h4 
              className="font-semibold text-sm mb-3"
              style={{ 
                fontFamily: `var(--font-text, ${theme.textFont})`,
                color: theme.primaryColor
              }}
            >
              Base Package
            </h4>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div 
                className="text-sm font-medium"
                style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
              >
                ${strategy.basePrice}/
                {strategy.billingPeriod === "monthly" ? "month" : "year"}
              </div>
              <div 
                className="text-xs"
                style={{
                  fontFamily: `var(--font-text, ${theme.textFont})`,
                  color: 'hsl(var(--muted-foreground))'
                }}
              >
                Core platform access
              </div>
            </div>
          </div>

          {/* Mandatory Features */}
          {mandatoryFeatures.length > 0 && (
            <div>
              <h4 
                className="font-semibold text-sm mb-3 flex items-center gap-2"
                style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
              >
                <Badge 
                  className="text-xs"
                  style={{ 
                    backgroundColor: '#ea580c',
                    color: 'white',
                    fontFamily: `var(--font-text, ${theme.textFont})`
                  }}
                >
                  Required
                </Badge>
                Included Features
              </h4>
              <ul className="space-y-2">
                {mandatoryFeatures.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: theme.primaryColor }} />
                      <span style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}>
                        {feature.name}
                      </span>
                    </div>
                    <span 
                      className="font-medium"
                      style={{ 
                        color: '#16a34a',
                        fontFamily: `var(--font-text, ${theme.textFont})`
                      }}
                    >
                      +${feature.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Optional Features */}
          {optionalFeatures.length > 0 && (
            <div>
              <h4 
                className="font-semibold text-sm mb-3 flex items-center gap-2"
                style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
              >
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                  style={{ 
                    borderColor: theme.secondaryColor,
                    fontFamily: `var(--font-text, ${theme.textFont})`
                  }}
                >
                  Optional
                </Badge>
                Add-on Features
              </h4>
              <ul className="space-y-2">
                {optionalFeatures.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between text-sm p-2 rounded border border-dashed border-muted-foreground/30"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
                        <span style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}>
                          {feature.name}
                        </span>
                      </div>
                      <div 
                        className="text-xs ml-6"
                        style={{
                          fontFamily: `var(--font-text, ${theme.textFont})`,
                          color: 'hsl(var(--muted-foreground))'
                        }}
                      >
                        {feature.description}
                      </div>
                    </div>
                    <span 
                      className="font-medium"
                      style={{ 
                        color: theme.primaryColor,
                        fontFamily: `var(--font-text, ${theme.textFont})`
                      }}
                    >
                      +${feature.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button 
            className="w-full"
            style={{ 
              fontFamily: `var(--font-button, ${theme.buttonFont})`,
              backgroundColor: theme.primaryColor,
              borderColor: theme.primaryColor
            }}
          >
            Start Customizing
          </Button>
        </CardContent>
      </Card>

      {/* Feature Breakdown */}
      <Card className="pricing-card" style={{ borderColor: theme.secondaryColor }}>
        <CardHeader>
          <CardTitle 
            className="text-lg"
            style={{ fontFamily: `var(--font-header, ${theme.headerFont})` }}
          >
            Build Your Package
          </CardTitle>
          <CardDescription 
            style={{
              fontFamily: `var(--font-text, ${theme.textFont})`,
              color: 'hsl(var(--muted-foreground))'
            }}
          >
            Customize your plan with the features you need
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span 
                className="font-medium"
                style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
              >
                Base Package
              </span>
              <span 
                className="font-bold"
                style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
              >
                ${strategy.basePrice}
              </span>
            </div>

            {mandatoryFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 border rounded"
              >
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" style={{ color: '#16a34a' }} />
                  <div>
                    <div 
                      className="font-medium text-sm"
                      style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
                    >
                      {feature.name}
                    </div>
                    <div 
                      className="text-xs"
                      style={{
                        fontFamily: `var(--font-text, ${theme.textFont})`,
                        color: 'hsl(var(--muted-foreground))'
                      }}
                    >
                      Required
                    </div>
                  </div>
                </div>
                <span 
                  className="font-medium"
                  style={{ 
                    color: '#16a34a',
                    fontFamily: `var(--font-text, ${theme.textFont})`
                  }}
                >
                  +${feature.price}
                </span>
              </div>
            ))}

            {optionalFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 border border-dashed rounded"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 border rounded-sm flex items-center justify-center"
                    style={{ borderColor: 'hsl(var(--muted-foreground))' }}
                  >
                    <Plus className="w-3 h-3" style={{ color: 'hsl(var(--muted-foreground))' }} />
                  </div>
                  <div>
                    <div 
                      className="font-medium text-sm"
                      style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
                    >
                      {feature.name}
                    </div>
                    <div 
                      className="text-xs"
                      style={{
                        fontFamily: `var(--font-text, ${theme.textFont})`,
                        color: 'hsl(var(--muted-foreground))'
                      }}
                    >
                      Optional
                    </div>
                  </div>
                </div>
                <span 
                  className="font-medium"
                  style={{
                    fontFamily: `var(--font-text, ${theme.textFont})`,
                    color: 'hsl(var(--muted-foreground))'
                  }}
                >
                  +${feature.price}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3">
            <div 
              className="flex justify-between items-center font-bold"
              style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
            >
              <span>Starting Total:</span>
              <span 
                className="text-lg"
                style={{ color: theme.primaryColor }}
              >
                ${totalPrice}/
                {strategy.billingPeriod === "monthly" ? "mo" : "yr"}
              </span>
            </div>
            <div 
              className="text-xs text-right"
              style={{
                fontFamily: `var(--font-text, ${theme.textFont})`,
                color: 'hsl(var(--muted-foreground))'
              }}
            >
              + selected optional features
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
