"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Star,
  Users,
  Package,
  Settings,
  Zap,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { ModelForm } from "./StrategyForm";
import { PricingModel, MODEL_LABELS } from "@shared/pricing";

interface ModelConfigCardProps {
  model: PricingModel;
  onUpdate: (id: string, updates: Partial<PricingModel>) => void;
  onRemove: (id: string) => void;
}

export function ModelConfigCard({
  model,
  onUpdate,
  onRemove,
}: ModelConfigCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const Icon =
    model.type === "flat-rate"
      ? Package
      : model.type === "usage-based"
        ? BarChart3
        : model.type === "tiered"
          ? Star
          : model.type === "per-user"
            ? Users
            : model.type === "freemium"
              ? Zap
              : Settings;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer flex-1 hover:bg-slate-700/30 -m-2 p-2 rounded-md transition-colors"
            onClick={toggleExpanded}
          >
            <div className="text-slate-400">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
            <Icon className="w-5 h-5 text-slate-300" />
            <CardTitle className="text-lg text-slate-100">
              {model.name}
            </CardTitle>
            <Badge
              variant="secondary"
              className="bg-slate-700 text-slate-200 border-slate-600"
            >
              {MODEL_LABELS[model.type]}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(model.id);
            }}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          <ModelForm model={model} onUpdate={onUpdate} />
        </CardContent>
      )}
    </Card>
  );
}
