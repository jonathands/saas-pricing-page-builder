import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { StrategyForm } from "./StrategyForm";
import {
  PricingStrategy,
  STRATEGY_LABELS,
} from "@shared/pricing";

interface StrategyConfigCardProps {
  strategy: PricingStrategy;
  onUpdate: (id: string, updates: Partial<PricingStrategy>) => void;
  onRemove: (id: string) => void;
}

export function StrategyConfigCard({
  strategy,
  onUpdate,
  onRemove,
}: StrategyConfigCardProps) {
  const Icon =
    strategy.type === "flat-rate"
      ? Package
      : strategy.type === "usage-based"
        ? BarChart3
        : strategy.type === "tiered"
          ? Star
          : strategy.type === "per-user"
            ? Users
            : strategy.type === "freemium"
              ? Zap
              : Settings;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-slate-300" />
            <CardTitle className="text-lg text-slate-100">
              {strategy.name}
            </CardTitle>
            <Badge
              variant="secondary"
              className="bg-slate-700 text-slate-200 border-slate-600"
            >
              {STRATEGY_LABELS[strategy.type]}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(strategy.id)}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <StrategyForm strategy={strategy} onUpdate={onUpdate} />
      </CardContent>
    </Card>
  );
}
