import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap } from "lucide-react";
import { FeatureDisplay } from "@/components/FeatureDisplay";
import { FreemiumStrategy } from "@shared/pricing";

interface FreemiumPreviewProps {
  strategy: FreemiumStrategy;
}

export function FreemiumPreview({ strategy }: FreemiumPreviewProps) {
  const allTiers = [
    {
      id: "free",
      name: "Free",
      price: 0,
      features: strategy.freeTier.features,
      usageLimit: strategy.freeTier.usageLimit,
      billingPeriod: "monthly" as const,
      isFree: true,
    },
    ...strategy.paidTiers.map(tier => ({ ...tier, isFree: false })),
  ];

  return (
    <div className={`grid gap-6 ${allTiers.length === 2 ? 'md:grid-cols-2' : allTiers.length === 3 ? 'md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
      {allTiers.map((tier) => (
        <Card 
          key={tier.id} 
          className={`relative ${tier.isFree ? 'border-green-500 bg-green-50/5' : ''}`}
        >
          {tier.isFree && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-green-600 text-white px-3 py-1">
                <Zap className="w-3 h-3 mr-1" />
                Free Forever
              </Badge>
            </div>
          )}
          
          <CardHeader className="text-center">
            <CardTitle className={tier.isFree ? 'text-green-600' : ''}>{tier.name}</CardTitle>
            <div className="space-y-1">
              <div className={`text-3xl font-bold ${tier.isFree ? 'text-green-600' : ''}`}>
                {tier.isFree ? 'Free' : `$${tier.price}`}
              </div>
              {!tier.isFree && (
                <div className="text-muted-foreground">
                  per {tier.billingPeriod === "monthly" ? "month" : "year"}
                </div>
              )}
              {tier.usageLimit && (
                <div className="text-sm text-muted-foreground">
                  {tier.usageLimit} {tier.isFree ? 'usage limit' : 'included'}
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className={`w-4 h-4 ${tier.isFree ? 'text-green-500' : 'text-primary'}`} />
                  {feature}
                </li>
              ))}
            </ul>
            
            <Button 
              className={`w-full ${tier.isFree ? 'bg-green-600 hover:bg-green-700' : ''}`}
              variant={tier.isFree ? "default" : "outline"}
            >
              {tier.isFree ? 'Get Started Free' : 'Upgrade Now'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
