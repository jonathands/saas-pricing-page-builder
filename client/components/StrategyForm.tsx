import {
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Package,
  Settings,
  Zap,
  CreditCard,
} from "lucide-react";
import {
  PricingStrategy,
  FlatRateStrategy,
  TieredStrategy,
  UsageBasedStrategy,
  PerUserStrategy,
  FreemiumStrategy,
  FeatureBasedStrategy,
  EnhancedFeature,
} from "@shared/pricing";
import { FeatureEditor } from "./FeatureEditor";

interface StrategyFormProps {
  strategy: PricingStrategy;
  onUpdate: (id: string, updates: Partial<PricingStrategy>) => void;
}

export function StrategyForm({
  strategy,
  onUpdate,
}: StrategyFormProps) {
  const updateField = (field: string, value: any) => {
    onUpdate(strategy.id, { [field]: value });
  };

  const updateNestedField = (
    parentField: string,
    field: string,
    value: any,
  ) => {
    const parent = (strategy as any)[parentField];
    onUpdate(strategy.id, {
      [parentField]: { ...parent, [field]: value },
    });
  };

  if (strategy.type === "flat-rate") {
    const flatStrategy = strategy as FlatRateStrategy;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-200">Price ($)</Label>
            <Input
              type="number"
              value={flatStrategy.price}
              onChange={(e) => updateField("price", Number(e.target.value))}
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
          </div>
          <div>
            <Label className="text-slate-200">Billing Period</Label>
            <Select
              value={flatStrategy.billingPeriod}
              onValueChange={(value) => updateField("billingPeriod", value)}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem
                  value="monthly"
                  className="text-slate-100 focus:bg-slate-700"
                >
                  Monthly
                </SelectItem>
                <SelectItem
                  value="yearly"
                  className="text-slate-100 focus:bg-slate-700"
                >
                  Yearly
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <FeatureEditor
          features={flatStrategy.features}
          onChange={(features: EnhancedFeature[]) => updateField("features", features)}
        />
      </div>
    );
  }

  if (strategy.type === "tiered") {
    const tieredStrategy = strategy as TieredStrategy;
    return (
      <div className="space-y-4">
        <div className="text-sm font-medium text-slate-200">
          Tiers Configuration
        </div>
        {tieredStrategy.tiers.map((tier, index) => (
          <Card key={tier.id} className="p-4 bg-slate-700 border-slate-600">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-slate-200">Tier Name</Label>
                  <Input
                    value={tier.name}
                    onChange={(e) => {
                      const newTiers = [...tieredStrategy.tiers];
                      newTiers[index] = { ...tier, name: e.target.value };
                      updateField("tiers", newTiers);
                    }}
                    className="bg-slate-600 border-slate-500 text-slate-100"
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Price ($)</Label>
                  <Input
                    type="number"
                    value={tier.price}
                    onChange={(e) => {
                      const newTiers = [...tieredStrategy.tiers];
                      newTiers[index] = {
                        ...tier,
                        price: Number(e.target.value),
                      };
                      updateField("tiers", newTiers);
                    }}
                    className="bg-slate-600 border-slate-500 text-slate-100"
                  />
                </div>
              </div>
              <div>
                <Label className="text-slate-200">
                  Features (one per line)
                </Label>
                <Textarea
                  value={tier.features.join("\n")}
                  onChange={(e) => {
                    const newTiers = [...tieredStrategy.tiers];
                    newTiers[index] = {
                      ...tier,
                      features: e.target.value
                        .split("\n")
                        .filter((f) => f.trim()),
                    };
                    updateField("tiers", newTiers);
                  }}
                  rows={3}
                  className="bg-slate-600 border-slate-500 text-slate-100 placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={tier.popular || false}
                  onCheckedChange={(checked) => {
                    const newTiers = [...tieredStrategy.tiers];
                    newTiers[index] = { ...tier, popular: checked };
                    updateField("tiers", newTiers);
                  }}
                />
                <Label className="text-slate-200">Mark as popular</Label>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (strategy.type === "usage-based") {
    const usageStrategy = strategy as UsageBasedStrategy;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-200">Base Price ($)</Label>
            <Input
              type="number"
              value={usageStrategy.basePrice}
              onChange={(e) => updateField("basePrice", Number(e.target.value))}
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
          </div>
          <div>
            <Label className="text-slate-200">Usage Price ($)</Label>
            <Input
              type="number"
              step="0.01"
              value={usageStrategy.usagePrice}
              onChange={(e) =>
                updateField("usagePrice", Number(e.target.value))
              }
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-200">Usage Unit</Label>
            <Input
              value={usageStrategy.usageUnit}
              onChange={(e) => updateField("usageUnit", e.target.value)}
              placeholder="e.g., API calls"
              className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
            />
          </div>
          <div>
            <Label className="text-slate-200">Included Usage</Label>
            <Input
              type="number"
              value={usageStrategy.includedUsage}
              onChange={(e) =>
                updateField("includedUsage", Number(e.target.value))
              }
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
          </div>
        </div>
        <div>
          <Label className="text-slate-200">Features (one per line)</Label>
          <Textarea
            value={usageStrategy.features.join("\n")}
            onChange={(e) =>
              updateField(
                "features",
                e.target.value.split("\n").filter((f) => f.trim()),
              )
            }
            rows={4}
            className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
          />
        </div>
      </div>
    );
  }

  if (strategy.type === "per-user") {
    const userStrategy = strategy as PerUserStrategy;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-200">Price Per User ($)</Label>
            <Input
              type="number"
              value={userStrategy.pricePerUser}
              onChange={(e) =>
                updateField("pricePerUser", Number(e.target.value))
              }
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
          </div>
          <div>
            <Label className="text-slate-200">Minimum Users</Label>
            <Input
              type="number"
              value={userStrategy.minimumUsers}
              onChange={(e) =>
                updateField("minimumUsers", Number(e.target.value))
              }
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
          </div>
        </div>
        <div>
          <Label className="text-slate-200">Billing Period</Label>
          <Select
            value={userStrategy.billingPeriod}
            onValueChange={(value) => updateField("billingPeriod", value)}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem
                value="monthly"
                className="text-slate-100 focus:bg-slate-700"
              >
                Monthly
              </SelectItem>
              <SelectItem
                value="yearly"
                className="text-slate-100 focus:bg-slate-700"
              >
                Yearly
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-slate-200">Features (one per line)</Label>
          <Textarea
            value={userStrategy.features.join("\n")}
            onChange={(e) =>
              updateField(
                "features",
                e.target.value.split("\n").filter((f) => f.trim()),
              )
            }
            rows={4}
            className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
          />
        </div>
      </div>
    );
  }

  if (strategy.type === "feature-based") {
    const featureStrategy = strategy as FeatureBasedStrategy;

    const addFeature = () => {
      const newFeatures = [
        ...featureStrategy.features,
        {
          id: `feature-${Date.now()}`,
          name: "New Feature",
          price: 10,
          description: "Feature description",
          mandatory: false,
        },
      ];
      updateField("features", newFeatures);
    };

    const updateFeature = (index: number, field: string, value: any) => {
      const newFeatures = [...featureStrategy.features];
      newFeatures[index] = { ...newFeatures[index], [field]: value };
      updateField("features", newFeatures);
    };

    const removeFeature = (index: number) => {
      const newFeatures = featureStrategy.features.filter(
        (_, i) => i !== index,
      );
      updateField("features", newFeatures);
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-200">Base Price ($)</Label>
            <Input
              type="number"
              value={featureStrategy.basePrice}
              onChange={(e) => updateField("basePrice", Number(e.target.value))}
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
          </div>
          <div>
            <Label className="text-slate-200">Billing Period</Label>
            <Select
              value={featureStrategy.billingPeriod}
              onValueChange={(value) => updateField("billingPeriod", value)}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem
                  value="monthly"
                  className="text-slate-100 focus:bg-slate-700"
                >
                  Monthly
                </SelectItem>
                <SelectItem
                  value="yearly"
                  className="text-slate-100 focus:bg-slate-700"
                >
                  Yearly
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-slate-200 text-base font-semibold">
              Features Configuration
            </Label>
            <Button
              type="button"
              onClick={addFeature}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
          </div>

          {featureStrategy.features.map((feature, index) => (
            <Card
              key={feature.id}
              className="p-4 bg-slate-700 border-slate-600"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-300" />
                    <Label className="text-slate-200 font-medium">
                      Feature {index + 1}
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    className="text-slate-400 hover:text-slate-200 hover:bg-slate-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-slate-200">Feature Name</Label>
                    <Input
                      value={feature.name}
                      onChange={(e) =>
                        updateFeature(index, "name", e.target.value)
                      }
                      className="bg-slate-600 border-slate-500 text-slate-100"
                      placeholder="e.g., Advanced Analytics"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-200">Price ($)</Label>
                    <Input
                      type="number"
                      value={feature.price}
                      onChange={(e) =>
                        updateFeature(index, "price", Number(e.target.value))
                      }
                      className="bg-slate-600 border-slate-500 text-slate-100"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-slate-200">Description</Label>
                  <Textarea
                    value={feature.description}
                    onChange={(e) =>
                      updateFeature(index, "description", e.target.value)
                    }
                    className="bg-slate-600 border-slate-500 text-slate-100 placeholder:text-slate-400"
                    placeholder="Brief description of the feature"
                    rows={2}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={(feature as any).mandatory || false}
                      onCheckedChange={(checked) =>
                        updateFeature(index, "mandatory", checked)
                      }
                    />
                    <Label className="text-slate-200">Mandatory Feature</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        (feature as any).mandatory ? "default" : "secondary"
                      }
                      className={
                        (feature as any).mandatory
                          ? "bg-orange-600 text-white"
                          : "bg-slate-600 text-slate-200"
                      }
                    >
                      {(feature as any).mandatory ? "Required" : "Optional"}
                    </Badge>
                  </div>
                </div>

                {!(feature as any).mandatory && (
                  <div className="bg-slate-800 p-3 rounded-md">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Settings className="w-4 h-4" />
                      <span>Customers can toggle this feature on/off</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}

          {featureStrategy.features.length === 0 && (
            <div className="text-center py-8 bg-slate-800 rounded-lg border-2 border-dashed border-slate-600">
              <Package className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-400 mb-3">No features configured</p>
              <Button
                type="button"
                onClick={addFeature}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Add Your First Feature
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (strategy.type === "freemium") {
    const freemiumStrategy = strategy as FreemiumStrategy;

    const addPaidTier = () => {
      const newPaidTiers = [
        ...freemiumStrategy.paidTiers,
        {
          id: `tier-${Date.now()}`,
          name: "New Tier",
          price: 29,
          features: ["Premium features"],
          billingPeriod: "monthly" as const,
        },
      ];
      updateField("paidTiers", newPaidTiers);
    };

    const updatePaidTier = (index: number, field: string, value: any) => {
      const newPaidTiers = [...freemiumStrategy.paidTiers];
      newPaidTiers[index] = { ...newPaidTiers[index], [field]: value };
      updateField("paidTiers", newPaidTiers);
    };

    const removePaidTier = (index: number) => {
      const newPaidTiers = freemiumStrategy.paidTiers.filter(
        (_, i) => i !== index,
      );
      updateField("paidTiers", newPaidTiers);
    };

    return (
      <div className="space-y-6">
        {/* Free Tier Configuration */}
        <Card className="p-4 bg-green-900/20 border-green-700">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-400" />
              <Label className="text-green-300 text-base font-semibold">
                Free Tier Configuration
              </Label>
              <Badge className="bg-green-600 text-white">Always Free</Badge>
            </div>

            <div>
              <Label className="text-slate-200">Features (one per line)</Label>
              <Textarea
                value={freemiumStrategy.freeTier.features.join("\n")}
                onChange={(e) => {
                  const newFreeTier = {
                    ...freemiumStrategy.freeTier,
                    features: e.target.value
                      .split("\n")
                      .filter((f) => f.trim()),
                  };
                  updateField("freeTier", newFreeTier);
                }}
                rows={3}
                className="bg-slate-600 border-slate-500 text-slate-100 placeholder:text-slate-400"
                placeholder="e.g., Basic access&#10;Community support&#10;1 project"
              />
            </div>

            <div>
              <Label className="text-slate-200">Usage Limit (optional)</Label>
              <Input
                type="number"
                value={freemiumStrategy.freeTier.usageLimit || ""}
                onChange={(e) => {
                  const newFreeTier = {
                    ...freemiumStrategy.freeTier,
                    usageLimit: e.target.value ? Number(e.target.value) : undefined,
                  };
                  updateField("freeTier", newFreeTier);
                }}
                className="bg-slate-600 border-slate-500 text-slate-100"
                placeholder="e.g., 100 API calls per month"
              />
            </div>
          </div>
        </Card>

        {/* Paid Tiers Configuration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-slate-200 text-base font-semibold">
              Paid Tiers Configuration
            </Label>
            <Button
              type="button"
              onClick={addPaidTier}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Paid Tier
            </Button>
          </div>

          {freemiumStrategy.paidTiers.map((tier, index) => (
            <Card key={tier.id} className="p-4 bg-slate-700 border-slate-600">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-slate-300" />
                    <Label className="text-slate-200 font-medium">
                      Paid Tier {index + 1}
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePaidTier(index)}
                    className="text-slate-400 hover:text-slate-200 hover:bg-slate-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-slate-200">Tier Name</Label>
                    <Input
                      value={tier.name}
                      onChange={(e) =>
                        updatePaidTier(index, "name", e.target.value)
                      }
                      className="bg-slate-600 border-slate-500 text-slate-100"
                      placeholder="e.g., Pro, Premium"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-200">Price ($)</Label>
                    <Input
                      type="number"
                      value={tier.price}
                      onChange={(e) =>
                        updatePaidTier(index, "price", Number(e.target.value))
                      }
                      className="bg-slate-600 border-slate-500 text-slate-100"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-slate-200">Billing Period</Label>
                    <Select
                      value={tier.billingPeriod}
                      onValueChange={(value) =>
                        updatePaidTier(index, "billingPeriod", value)
                      }
                    >
                      <SelectTrigger className="bg-slate-600 border-slate-500 text-slate-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem
                          value="monthly"
                          className="text-slate-100 focus:bg-slate-700"
                        >
                          Monthly
                        </SelectItem>
                        <SelectItem
                          value="yearly"
                          className="text-slate-100 focus:bg-slate-700"
                        >
                          Yearly
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-200">Usage Limit (optional)</Label>
                    <Input
                      type="number"
                      value={tier.usageLimit || ""}
                      onChange={(e) =>
                        updatePaidTier(
                          index,
                          "usageLimit",
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                      className="bg-slate-600 border-slate-500 text-slate-100"
                      placeholder="Leave empty for unlimited"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-slate-200">Features (one per line)</Label>
                  <Textarea
                    value={tier.features.join("\n")}
                    onChange={(e) => {
                      updatePaidTier(
                        index,
                        "features",
                        e.target.value.split("\n").filter((f) => f.trim()),
                      );
                    }}
                    rows={3}
                    className="bg-slate-600 border-slate-500 text-slate-100 placeholder:text-slate-400"
                    placeholder="e.g., Priority support&#10;Advanced features&#10;Unlimited projects"
                  />
                </div>
              </div>
            </Card>
          ))}

          {freemiumStrategy.paidTiers.length === 0 && (
            <div className="text-center py-8 bg-slate-800 rounded-lg border-2 border-dashed border-slate-600">
              <CreditCard className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-400 mb-3">No paid tiers configured</p>
              <Button
                type="button"
                onClick={addPaidTier}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Add Your First Paid Tier
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 text-center text-slate-400">
      Configuration form for {(strategy as any).type} coming soon...
    </div>
  );
}
