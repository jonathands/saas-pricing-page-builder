import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Plus,
  Trash2,
  Check,
  Star,
  Zap,
  Shield,
  Users,
  BarChart3,
  Settings,
  Globe,
  Clock,
  Heart,
  Award,
  Lock,
  Smartphone,
  Cloud,
  Database,
  Mail,
  Phone,
  CreditCard,
  FileText,
  Headphones,
  Wifi,
  Package,
  Truck,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { EnhancedFeature } from "@shared/pricing";

interface FeatureEditorProps {
  features: string[] | EnhancedFeature[];
  onChange: (features: EnhancedFeature[]) => void;
  className?: string;
}

// Popular feature icons
const FEATURE_ICONS = [
  { name: "Check", icon: Check, label: "Check" },
  { name: "Star", icon: Star, label: "Star" },
  { name: "Zap", icon: Zap, label: "Lightning" },
  { name: "Shield", icon: Shield, label: "Shield" },
  { name: "Users", icon: Users, label: "Users" },
  { name: "BarChart3", icon: BarChart3, label: "Analytics" },
  { name: "Settings", icon: Settings, label: "Settings" },
  { name: "Globe", icon: Globe, label: "Global" },
  { name: "Clock", icon: Clock, label: "Time" },
  { name: "Heart", icon: Heart, label: "Heart" },
  { name: "Award", icon: Award, label: "Award" },
  { name: "Lock", icon: Lock, label: "Security" },
  { name: "Smartphone", icon: Smartphone, label: "Mobile" },
  { name: "Cloud", icon: Cloud, label: "Cloud" },
  { name: "Database", icon: Database, label: "Database" },
  { name: "Mail", icon: Mail, label: "Email" },
  { name: "Phone", icon: Phone, label: "Phone" },
  { name: "CreditCard", icon: CreditCard, label: "Payment" },
  { name: "FileText", icon: FileText, label: "Documents" },
  { name: "Headphones", icon: Headphones, label: "Support" },
  { name: "Wifi", icon: Wifi, label: "Network" },
  { name: "Package", icon: Package, label: "Package" },
  { name: "Truck", icon: Truck, label: "Delivery" },
  { name: "ArrowRight", icon: ArrowRight, label: "Arrow" },
  { name: "ChevronRight", icon: ChevronRight, label: "Chevron" },
];

export function FeatureEditor({ features, onChange, className = "" }: FeatureEditorProps) {
  // Convert legacy string array to enhanced features
  const enhancedFeatures: EnhancedFeature[] = Array.isArray(features)
    ? features.map((feature, index) => {
        if (typeof feature === "string") {
          return {
            id: `feature-${index}-${Date.now()}`,
            text: feature,
            icon: "Check",
            iconPosition: "before" as const,
          };
        }
        return feature;
      })
    : [];

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addFeature = () => {
    const newFeature: EnhancedFeature = {
      id: `feature-${Date.now()}`,
      text: "New feature",
      icon: "Check",
      iconPosition: "before",
    };
    const updatedFeatures = [...enhancedFeatures, newFeature];
    onChange(updatedFeatures);
    setEditingIndex(updatedFeatures.length - 1);
  };

  const updateFeature = (index: number, updates: Partial<EnhancedFeature>) => {
    const updatedFeatures = enhancedFeatures.map((feature, i) =>
      i === index ? { ...feature, ...updates } : feature
    );
    onChange(updatedFeatures);
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = enhancedFeatures.filter((_, i) => i !== index);
    onChange(updatedFeatures);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
  };

  const stopEditing = () => {
    setEditingIndex(null);
  };

  const getIconComponent = (iconName: string) => {
    const iconData = FEATURE_ICONS.find(icon => icon.name === iconName);
    return iconData ? iconData.icon : Check;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-slate-200 text-base font-semibold">
          Features
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

      <div className="space-y-2">
        {enhancedFeatures.map((feature, index) => {
          const IconComponent = getIconComponent(feature.icon || "Check");
          const isEditing = editingIndex === index;

          return (
            <div
              key={feature.id}
              className="bg-slate-700 border border-slate-600 rounded-lg p-3 transition-colors hover:bg-slate-700/80"
            >
              {isEditing ? (
                <div className="space-y-3">
                  {/* Feature Text Input */}
                  <div>
                    <Label className="text-slate-200 text-sm">Feature Text</Label>
                    <Input
                      value={feature.text}
                      onChange={(e) => updateFeature(index, { text: e.target.value })}
                      className="bg-slate-600 border-slate-500 text-slate-100"
                      placeholder="Enter feature description"
                    />
                  </div>

                  {/* Icon Selection */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-slate-200 text-sm">Icon</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start bg-slate-600 border-slate-500 text-slate-100"
                          >
                            <IconComponent className="w-4 h-4 mr-2" />
                            {FEATURE_ICONS.find(icon => icon.name === feature.icon)?.label || "Check"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-slate-800 border-slate-600" align="start">
                          <div className="grid grid-cols-5 gap-2">
                            {FEATURE_ICONS.map((iconData) => {
                              const Icon = iconData.icon;
                              return (
                                <Button
                                  key={iconData.name}
                                  variant={feature.icon === iconData.name ? "default" : "ghost"}
                                  size="sm"
                                  onClick={() => updateFeature(index, { icon: iconData.name })}
                                  className="h-10 w-10 p-0"
                                  title={iconData.label}
                                >
                                  <Icon className="w-4 h-4" />
                                </Button>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label className="text-slate-200 text-sm">Icon Position</Label>
                      <Select
                        value={feature.iconPosition || "before"}
                        onValueChange={(value: "before" | "after") =>
                          updateFeature(index, { iconPosition: value })
                        }
                      >
                        <SelectTrigger className="bg-slate-600 border-slate-500 text-slate-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="before" className="text-slate-100 focus:bg-slate-700">
                            Before text
                          </SelectItem>
                          <SelectItem value="after" className="text-slate-100 focus:bg-slate-700">
                            After text
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-slate-800 p-3 rounded-md">
                    <div className="text-sm text-slate-300 mb-2">Preview:</div>
                    <div className="flex items-center gap-2 text-slate-100">
                      {feature.iconPosition === "before" && <IconComponent className="w-4 h-4 text-primary" />}
                      <span>{feature.text}</span>
                      {feature.iconPosition === "after" && <IconComponent className="w-4 h-4 text-primary" />}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={stopEditing}
                      className="text-slate-300 hover:text-slate-100"
                    >
                      Done
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div 
                    className="flex items-center gap-2 cursor-pointer flex-1"
                    onClick={() => startEditing(index)}
                  >
                    {feature.iconPosition === "before" && <IconComponent className="w-4 h-4 text-primary" />}
                    <span className="text-slate-100">{feature.text}</span>
                    {feature.iconPosition === "after" && <IconComponent className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(index)}
                      className="text-slate-400 hover:text-slate-200 hover:bg-slate-600"
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      className="text-slate-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {enhancedFeatures.length === 0 && (
          <div className="text-center py-8 bg-slate-800 rounded-lg border-2 border-dashed border-slate-600">
            <Package className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-400 mb-3">No features added</p>
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
