"use client";

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
  Edit3,
} from "lucide-react";
import { PricingModel, MODEL_LABELS } from "@shared/pricing";

interface ModelListProps {
  models: PricingModel[];
  onEdit: (model: PricingModel) => void;
  onRemove: (id: string) => void;
}

export function ModelList({ models, onEdit, onRemove }: ModelListProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "flat-rate":
        return Package;
      case "usage-based":
        return BarChart3;
      case "tiered":
        return Star;
      case "per-user":
        return Users;
      case "freemium":
        return Zap;
      case "feature-based":
        return Settings;
      default:
        return Package;
    }
  };

  if (models.length === 0) {
    return (
      <div className="text-center py-8 bg-slate-800 rounded-lg border-2 border-dashed border-slate-600">
        <Package className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <p className="text-slate-400 mb-3">No models added</p>
        <p className="text-sm text-slate-500">
          Add your first pricing model to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {models.map((model) => {
        const Icon = getIcon(model.type);
        return (
          <div
            key={model.id}
            className="bg-slate-800 border border-slate-700 rounded-lg p-3 hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Icon className="w-5 h-5 text-slate-300 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-slate-100 truncate">
                    {model.name}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="bg-slate-700 text-slate-300 border-slate-600 text-xs mt-1"
                  >
                    {MODEL_LABELS[model.type]}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(model)}
                  className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 h-8 w-8 p-0"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(model.id)}
                  className="text-slate-400 hover:text-red-400 hover:bg-slate-700 h-8 w-8 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}