"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  BarChart3,
  Star,
  Users,
  Zap,
  Settings,
  DollarSign,
  Clock,
  Shield,
  Plus,
  Trash2,
  Edit3,
} from "lucide-react";
import {
  PricingModel,
  PricingModelType,
  MODEL_LABELS,
  MODEL_DESCRIPTIONS,
  FlatRateModel,
  TieredModel,
  UsageBasedModel,
  PerUserModel,
  FreemiumModel,
  FeatureBasedModel,
} from "@shared/pricing";
import { ModelService } from "@/services/strategyService";

interface AddModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddModel: (model: PricingModel) => void;
  onUpdateModel?: (model: PricingModel) => void;
  editingModel?: PricingModel | null;
}

export function AddModelModal({
  isOpen,
  onClose,
  onAddModel,
  onUpdateModel,
  editingModel,
}: AddModelModalProps) {
  const [selectedType, setSelectedType] = useState<PricingModelType>("tiered");
  const [modelName, setModelName] = useState("");
  const [modelDescription, setModelDescription] = useState("");
  const [currentModel, setCurrentModel] = useState<Partial<PricingModel>>({});
  const isEditing = !!editingModel;

  const getModelIcon = (type: PricingModelType) => {
    const icons = {
      "flat-rate": Package,
      "usage-based": BarChart3,
      tiered: Star,
      "per-user": Users,
      freemium: Zap,
      "feature-based": Settings,
    };
    return icons[type];
  };

  // Initialize modal state when editing or opening
  useEffect(() => {
    if (isOpen) {
      if (editingModel) {
        // Editing mode - populate with existing model
        setSelectedType(editingModel.type);
        setModelName(editingModel.name);
        setModelDescription(editingModel.description || "");
        setCurrentModel({ ...editingModel });
      } else {
        // Add mode - reset to default
        setSelectedType("tiered");
        setModelName(ModelService.getDefaultName("tiered"));
        setModelDescription(MODEL_DESCRIPTIONS["tiered"]);
        const template = ModelService.getTemplate("tiered");
        setCurrentModel({ ...template });
      }
    }
  }, [isOpen, editingModel]);

  const handleTypeChange = (type: PricingModelType) => {
    if (isEditing) return; // Don't allow type changes when editing
    setSelectedType(type);
    setModelName(ModelService.getDefaultName(type));
    setModelDescription(MODEL_DESCRIPTIONS[type]);
    const template = ModelService.getTemplate(type);
    setCurrentModel({ ...template });
  };

  const handleSubmit = () => {
    if (!modelName.trim()) return;

    if (isEditing && onUpdateModel && editingModel) {
      // Update existing model
      const updatedModel: PricingModel = {
        ...currentModel,
        id: editingModel.id,
        name: modelName,
        description: modelDescription,
        type: selectedType,
      } as PricingModel;

      onUpdateModel(updatedModel);
    } else {
      // Create new model
      const newModel: PricingModel = {
        ...currentModel,
        id: ModelService.generateId(),
        name: modelName,
        description: modelDescription,
        type: selectedType,
      } as PricingModel;

      onAddModel(newModel);
    }

    onClose();
    resetForm();
  };

  const handleCancel = () => {
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setSelectedType("tiered");
    setModelName("");
    setModelDescription("");
    setCurrentModel({});
  };

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen && !modelName) {
      const defaultType = "tiered";
      setSelectedType(defaultType);
      setModelName(ModelService.getDefaultName(defaultType));
      setModelDescription(MODEL_DESCRIPTIONS[defaultType]);
      const template = ModelService.getTemplate(defaultType);
      setCurrentModel({ ...template });
    }
  }, [isOpen]);

  const renderConfigurationForm = () => {
    switch (selectedType) {
      case "flat-rate":
        return <FlatRateConfigForm model={currentModel as FlatRateModel} onChange={setCurrentModel} />;
      case "tiered":
        return <TieredConfigForm model={currentModel as TieredModel} onChange={setCurrentModel} />;
      case "usage-based":
        return <UsageBasedConfigForm model={currentModel as UsageBasedModel} onChange={setCurrentModel} />;
      case "per-user":
        return <PerUserConfigForm model={currentModel as PerUserModel} onChange={setCurrentModel} />;
      case "freemium":
        return <FreemiumConfigForm model={currentModel as FreemiumModel} onChange={setCurrentModel} />;
      case "feature-based":
        return <FeatureBasedConfigForm model={currentModel as FeatureBasedModel} onChange={setCurrentModel} />;
      default:
        return null;
    }
  };

  const Icon = getModelIcon(selectedType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? <Edit3 className="w-5 h-5" /> : <Package className="w-5 h-5" />}
            {isEditing ? 'Edit Pricing Model' : 'Add New Pricing Model'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update your pricing model settings' : 'Configure your pricing model with detailed settings'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model-name">Model Name</Label>
              <Input
                id="model-name"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Enter model name"
                className="form-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model-type">Pricing Model</Label>
              <Select
                value={selectedType}
                onValueChange={(value: PricingModelType) => handleTypeChange(value)}
                disabled={isEditing}
              >
                <SelectTrigger className={`form-select ${isEditing ? 'opacity-60' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(MODEL_LABELS) as PricingModelType[]).map((type) => {
                    const IconComponent = getModelIcon(type);
                    return (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          {MODEL_LABELS[type]}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model-description">Description</Label>
            <Textarea
              id="model-description"
              value={modelDescription}
              onChange={(e) => setModelDescription(e.target.value)}
              placeholder="Describe your pricing model"
              className="form-input min-h-[80px]"
            />
          </div>

          <Separator />

          {/* Model Configuration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Configure {MODEL_LABELS[selectedType]}</h3>
            </div>
            {renderConfigurationForm()}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!modelName.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            Create Model
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Configuration form components
function FlatRateConfigForm({
  model,
  onChange
}: {
  model: FlatRateModel;
  onChange: (model: Partial<PricingModel>) => void;
}) {
  const updateModel = (updates: Partial<FlatRateModel>) => {
    onChange({ ...model, ...updates });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <Label className="form-label">Price ($)</Label>
          <Input
            type="number"
            value={model.price || 29}
            onChange={(e) => updateModel({ price: parseFloat(e.target.value) || 0 })}
            className="form-input"
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <Label className="form-label">Billing Period</Label>
          <Select
            value={model.billingPeriod || "monthly"}
            onValueChange={(value: "monthly" | "yearly") => updateModel({ billingPeriod: value })}
          >
            <SelectTrigger className="form-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <FeaturesList
        features={model.features || []}
        onChange={(features) => updateModel({ features })}
      />
    </div>
  );
}

function TieredConfigForm({
  model,
  onChange
}: {
  model: TieredModel;
  onChange: (model: Partial<PricingModel>) => void;
}) {
  const updateModel = (updates: Partial<TieredModel>) => {
    onChange({ ...model, ...updates });
  };

  const addTier = () => {
    const newTier = {
      id: `tier-${Date.now()}`,
      name: "New Tier",
      price: 0,
      features: [],
      billingPeriod: "monthly" as const,
    };
    updateModel({ tiers: [...(model.tiers || []), newTier] });
  };

  const updateTier = (index: number, updates: any) => {
    const tiers = [...(model.tiers || [])];
    tiers[index] = { ...tiers[index], ...updates };
    updateModel({ tiers });
  };

  const removeTier = (index: number) => {
    const tiers = (model.tiers || []).filter((_, i) => i !== index);
    updateModel({ tiers });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Pricing Tiers</h4>
        <Button onClick={addTier} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />
          Add Tier
        </Button>
      </div>

      <div className="space-y-4">
        {(model.tiers || []).map((tier, index) => (
          <Card key={tier.id} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="font-medium">Tier {index + 1}</h5>
                {(model.tiers || []).length > 1 && (
                  <Button
                    onClick={() => removeTier(index)}
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-group">
                  <Label className="form-label">Tier Name</Label>
                  <Input
                    value={tier.name}
                    onChange={(e) => updateTier(index, { name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <Label className="form-label">Price ($)</Label>
                  <Input
                    type="number"
                    value={tier.price}
                    onChange={(e) => updateTier(index, { price: parseFloat(e.target.value) || 0 })}
                    className="form-input"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <Label className="form-label">Popular?</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch
                      checked={tier.popular || false}
                      onCheckedChange={(checked) => updateTier(index, { popular: checked })}
                    />
                    <span className="text-sm text-muted-foreground">Mark as popular</span>
                  </div>
                </div>
              </div>

              <FeaturesList
                features={tier.features || []}
                onChange={(features) => updateTier(index, { features })}
                title="Tier Features"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function UsageBasedConfigForm({
  model,
  onChange
}: {
  model: UsageBasedModel;
  onChange: (model: Partial<PricingModel>) => void;
}) {
  const updateModel = (updates: Partial<UsageBasedModel>) => {
    onChange({ ...model, ...updates });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <Label className="form-label">Base Price ($)</Label>
          <Input
            type="number"
            value={model.basePrice || 10}
            onChange={(e) => updateModel({ basePrice: parseFloat(e.target.value) || 0 })}
            className="form-input"
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <Label className="form-label">Usage Price ($)</Label>
          <Input
            type="number"
            value={model.usagePrice || 0.05}
            onChange={(e) => updateModel({ usagePrice: parseFloat(e.target.value) || 0 })}
            className="form-input"
            min="0"
            step="0.001"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <Label className="form-label">Usage Unit</Label>
          <Input
            value={model.usageUnit || "API calls"}
            onChange={(e) => updateModel({ usageUnit: e.target.value })}
            className="form-input"
            placeholder="e.g., API calls, GB, requests"
          />
        </div>
        <div className="form-group">
          <Label className="form-label">Included Usage</Label>
          <Input
            type="number"
            value={model.includedUsage || 1000}
            onChange={(e) => updateModel({ includedUsage: parseInt(e.target.value) || 0 })}
            className="form-input"
            min="0"
          />
        </div>
      </div>

      <FeaturesList
        features={model.features || []}
        onChange={(features) => updateModel({ features })}
      />
    </div>
  );
}

function PerUserConfigForm({
  model,
  onChange
}: {
  model: PerUserModel;
  onChange: (model: Partial<PricingModel>) => void;
}) {
  const updateModel = (updates: Partial<PerUserModel>) => {
    onChange({ ...model, ...updates });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="form-group">
          <Label className="form-label">Price Per User ($)</Label>
          <Input
            type="number"
            value={model.pricePerUser || 15}
            onChange={(e) => updateModel({ pricePerUser: parseFloat(e.target.value) || 0 })}
            className="form-input"
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <Label className="form-label">Minimum Users</Label>
          <Input
            type="number"
            value={model.minimumUsers || 3}
            onChange={(e) => updateModel({ minimumUsers: parseInt(e.target.value) || 1 })}
            className="form-input"
            min="1"
          />
        </div>
        <div className="form-group">
          <Label className="form-label">Billing Period</Label>
          <Select
            value={model.billingPeriod || "monthly"}
            onValueChange={(value: "monthly" | "yearly") => updateModel({ billingPeriod: value })}
          >
            <SelectTrigger className="form-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <FeaturesList
        features={model.features || []}
        onChange={(features) => updateModel({ features })}
      />
    </div>
  );
}

function FreemiumConfigForm({
  model,
  onChange
}: {
  model: FreemiumModel;
  onChange: (model: Partial<PricingModel>) => void;
}) {
  const updateModel = (updates: Partial<FreemiumModel>) => {
    onChange({ ...model, ...updates });
  };

  const addPaidTier = () => {
    const newTier = {
      id: `tier-${Date.now()}`,
      name: "New Tier",
      price: 0,
      features: [],
      billingPeriod: "monthly" as const,
    };
    updateModel({ paidTiers: [...(model.paidTiers || []), newTier] });
  };

  const updatePaidTier = (index: number, updates: any) => {
    const tiers = [...(model.paidTiers || [])];
    tiers[index] = { ...tiers[index], ...updates };
    updateModel({ paidTiers: tiers });
  };

  const removePaidTier = (index: number) => {
    const tiers = (model.paidTiers || []).filter((_, i) => i !== index);
    updateModel({ paidTiers: tiers });
  };

  return (
    <div className="space-y-6">
      {/* Free Tier Configuration */}
      <Card className="p-4">
        <h4 className="font-medium mb-4">Free Tier</h4>
        <div className="space-y-4">
          <div className="form-group">
            <Label className="form-label">Usage Limit</Label>
            <Input
              type="number"
              value={model.freeTier?.usageLimit || 100}
              onChange={(e) => updateModel({
                freeTier: {
                  ...model.freeTier,
                  usageLimit: parseInt(e.target.value) || 0
                }
              })}
              className="form-input"
              min="0"
            />
          </div>

          <FeaturesList
            features={model.freeTier?.features || []}
            onChange={(features) => updateModel({
              freeTier: { ...model.freeTier, features }
            })}
            title="Free Features"
          />
        </div>
      </Card>

      {/* Paid Tiers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Paid Tiers</h4>
          <Button onClick={addPaidTier} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Paid Tier
          </Button>
        </div>

        <div className="space-y-4">
          {(model.paidTiers || []).map((tier, index) => (
            <Card key={tier.id} className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">Paid Tier {index + 1}</h5>
                  <Button
                    onClick={() => removePaidTier(index)}
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-group">
                    <Label className="form-label">Tier Name</Label>
                    <Input
                      value={tier.name}
                      onChange={(e) => updatePaidTier(index, { name: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <Label className="form-label">Price ($)</Label>
                    <Input
                      type="number"
                      value={tier.price}
                      onChange={(e) => updatePaidTier(index, { price: parseFloat(e.target.value) || 0 })}
                      className="form-input"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <Label className="form-label">Usage Limit</Label>
                    <Input
                      type="number"
                      value={tier.usageLimit || 0}
                      onChange={(e) => updatePaidTier(index, { usageLimit: parseInt(e.target.value) || 0 })}
                      className="form-input"
                      min="0"
                    />
                  </div>
                </div>

                <FeaturesList
                  features={tier.features || []}
                  onChange={(features) => updatePaidTier(index, { features })}
                  title="Tier Features"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureBasedConfigForm({
  model,
  onChange
}: {
  model: FeatureBasedModel;
  onChange: (model: Partial<PricingModel>) => void;
}) {
  const updateModel = (updates: Partial<FeatureBasedModel>) => {
    onChange({ ...model, ...updates });
  };

  const addFeature = () => {
    const newFeature = {
      id: `feature-${Date.now()}`,
      name: "New Feature",
      price: 0,
      description: "",
    };
    updateModel({ features: [...(model.features || []), newFeature] });
  };

  const updateFeature = (index: number, updates: any) => {
    const features = [...(model.features || [])];
    features[index] = { ...features[index], ...updates };
    updateModel({ features });
  };

  const removeFeature = (index: number) => {
    const features = (model.features || []).filter((_, i) => i !== index);
    updateModel({ features });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <Label className="form-label">Base Price ($)</Label>
          <Input
            type="number"
            value={model.basePrice || 19}
            onChange={(e) => updateModel({ basePrice: parseFloat(e.target.value) || 0 })}
            className="form-input"
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <Label className="form-label">Billing Period</Label>
          <Select
            value={model.billingPeriod || "monthly"}
            onValueChange={(value: "monthly" | "yearly") => updateModel({ billingPeriod: value })}
          >
            <SelectTrigger className="form-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Optional Features</h4>
          <Button onClick={addFeature} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Feature
          </Button>
        </div>

        <div className="space-y-4">
          {(model.features || []).map((feature, index) => (
            <Card key={feature.id} className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">Feature {index + 1}</h5>
                  <Button
                    onClick={() => removeFeature(index)}
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <Label className="form-label">Feature Name</Label>
                    <Input
                      value={feature.name}
                      onChange={(e) => updateFeature(index, { name: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <Label className="form-label">Price ($)</Label>
                    <Input
                      type="number"
                      value={feature.price}
                      onChange={(e) => updateFeature(index, { price: parseFloat(e.target.value) || 0 })}
                      className="form-input"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <Label className="form-label">Description</Label>
                  <Textarea
                    value={feature.description}
                    onChange={(e) => updateFeature(index, { description: e.target.value })}
                    className="form-input"
                    placeholder="Describe this feature"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Reusable Features List Component
function FeaturesList({
  features,
  onChange,
  title = "Features"
}: {
  features: any[];
  onChange: (features: any[]) => void;
  title?: string;
}) {
  const addFeature = () => {
    const newFeature = {
      id: `feature-${Date.now()}`,
      text: "New feature",
      icon: "Star",
      iconPosition: "before" as const,
    };
    onChange([...features, newFeature]);
  };

  const updateFeature = (index: number, updates: any) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = { ...updatedFeatures[index], ...updates };
    onChange(updatedFeatures);
  };

  const removeFeature = (index: number) => {
    onChange(features.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{title}</h4>
        <Button onClick={addFeature} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />
          Add Feature
        </Button>
      </div>

      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={feature.id} className="flex items-center gap-2 p-2 border rounded-md">
            <Input
              value={feature.text}
              onChange={(e) => updateFeature(index, { text: e.target.value })}
              className="flex-1 form-input"
              placeholder="Feature description"
            />
            <Button
              onClick={() => removeFeature(index)}
              size="sm"
              variant="ghost"
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}