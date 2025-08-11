import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { FeatureDisplay } from "@/components/FeatureDisplay";
import { PerUserStrategy } from "@shared/pricing";

interface PerUserPreviewProps {
  strategy: PerUserStrategy;
}

export function PerUserPreview({ strategy }: PerUserPreviewProps) {
  const { theme } = useTheme();
  const sampleUserCounts = [3, 5, 10, 25, 50];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
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
              ${strategy.pricePerUser}
            </div>
            <div 
              style={{
                fontFamily: `var(--font-text, ${theme.textFont})`,
                color: 'hsl(var(--muted-foreground))'
              }}
            >
              per user /{" "}
              {strategy.billingPeriod === "monthly" ? "month" : "year"}
            </div>
            <div 
              className="text-sm"
              style={{
                fontFamily: `var(--font-text, ${theme.textFont})`,
                color: 'hsl(var(--muted-foreground))'
              }}
            >
              Minimum {strategy.minimumUsers} users
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <FeatureDisplay
            features={strategy.features}
            iconColorClass="text-primary"
            style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
          />
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
            Pricing Examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sampleUserCounts.map((userCount) => {
              const effectiveUsers = Math.max(userCount, strategy.minimumUsers);
              const totalCost = effectiveUsers * strategy.pricePerUser;
              return (
                <div 
                  key={userCount} 
                  className="flex justify-between text-sm"
                  style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
                >
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
