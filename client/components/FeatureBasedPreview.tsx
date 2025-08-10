import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus } from "lucide-react";
import { FeatureBasedStrategy } from "@shared/pricing";

export function FeatureBasedPreview({ strategy }: { strategy: FeatureBasedStrategy }) {
  const mandatoryFeatures = strategy.features.filter((f: any) => f.mandatory);
  const optionalFeatures = strategy.features.filter((f: any) => !f.mandatory);
  const mandatoryTotal = mandatoryFeatures.reduce((sum, f) => sum + f.price, 0);
  const totalPrice = strategy.basePrice + mandatoryTotal;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="pricing-card">
        <CardHeader className="text-center">
          <CardTitle>{strategy.name}</CardTitle>
          <div className="space-y-1">
            <div className="text-2xl font-bold">
              From ${totalPrice}
              <span className="text-lg text-muted-foreground">/{strategy.billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Base price: ${strategy.basePrice}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Base Features */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-primary">Base Package</h4>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-sm font-medium">${strategy.basePrice}/{strategy.billingPeriod === 'monthly' ? 'month' : 'year'}</div>
              <div className="text-xs text-muted-foreground">Core platform access</div>
            </div>
          </div>

          {/* Mandatory Features */}
          {mandatoryFeatures.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Badge className="bg-orange-600 text-white text-xs">Required</Badge>
                Included Features
              </h4>
              <ul className="space-y-2">
                {mandatoryFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span>{feature.name}</span>
                    </div>
                    <span className="font-medium text-green-600">+${feature.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Optional Features */}
          {optionalFeatures.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">Optional</Badge>
                Add-on Features
              </h4>
              <ul className="space-y-2">
                {optionalFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center justify-between text-sm p-2 rounded border border-dashed border-muted-foreground/30">
                    <div>
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-muted-foreground" />
                        <span>{feature.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground ml-6">{feature.description}</div>
                    </div>
                    <span className="font-medium text-primary">+${feature.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button className="w-full">
            Start Customizing
          </Button>
        </CardContent>
      </Card>

      {/* Feature Breakdown */}
      <Card className="pricing-card">
        <CardHeader>
          <CardTitle className="text-lg">Build Your Package</CardTitle>
          <CardDescription>
            Customize your plan with the features you need
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="font-medium">Base Package</span>
              <span className="font-bold">${strategy.basePrice}</span>
            </div>

            {mandatoryFeatures.map((feature, index) => (
              <div key={index} className="flex justify-between items-center p-2 border rounded">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="font-medium text-sm">{feature.name}</div>
                    <div className="text-xs text-muted-foreground">Required</div>
                  </div>
                </div>
                <span className="font-medium text-green-600">+${feature.price}</span>
              </div>
            ))}

            {optionalFeatures.map((feature, index) => (
              <div key={index} className="flex justify-between items-center p-2 border border-dashed rounded">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-muted-foreground rounded-sm flex items-center justify-center">
                    <Plus className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{feature.name}</div>
                    <div className="text-xs text-muted-foreground">Optional</div>
                  </div>
                </div>
                <span className="font-medium text-muted-foreground">+${feature.price}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between items-center font-bold">
              <span>Starting Total:</span>
              <span className="text-lg">${totalPrice}/{strategy.billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
            </div>
            <div className="text-xs text-muted-foreground text-right">
              + selected optional features
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
