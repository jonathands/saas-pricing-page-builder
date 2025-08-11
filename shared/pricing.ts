/**
 * Shared types for SaaS pricing strategies
 */

export interface EnhancedFeature {
  id: string;
  text: string;
  icon?: string;
  iconPosition?: "before" | "after";
}

export type PricingStrategyType =
  | "flat-rate"
  | "usage-based"
  | "tiered"
  | "per-user"
  | "freemium"
  | "feature-based";

export interface BasePricingStrategy {
  id: string;
  type: PricingStrategyType;
  name: string;
  description: string;
}

export interface FlatRateStrategy extends BasePricingStrategy {
  type: "flat-rate";
  price: number;
  features: string[] | EnhancedFeature[];
  billingPeriod: "monthly" | "yearly";
}

export interface UsageBasedStrategy extends BasePricingStrategy {
  type: "usage-based";
  basePrice: number;
  usagePrice: number;
  usageUnit: string;
  includedUsage: number;
  features: string[] | EnhancedFeature[];
}

export interface TieredStrategy extends BasePricingStrategy {
  type: "tiered";
  tiers: {
    id: string;
    name: string;
    price: number;
    features: string[] | EnhancedFeature[];
    usageLimit?: number;
    billingPeriod: "monthly" | "yearly";
    popular?: boolean;
  }[];
}

export interface PerUserStrategy extends BasePricingStrategy {
  type: "per-user";
  pricePerUser: number;
  minimumUsers: number;
  features: string[];
  billingPeriod: "monthly" | "yearly";
}

export interface FreemiumStrategy extends BasePricingStrategy {
  type: "freemium";
  freeTier: {
    features: string[];
    usageLimit?: number;
  };
  paidTiers: {
    id: string;
    name: string;
    price: number;
    features: string[];
    usageLimit?: number;
    billingPeriod: "monthly" | "yearly";
  }[];
}

export interface FeatureBasedStrategy extends BasePricingStrategy {
  type: "feature-based";
  basePrice: number;
  features: {
    id: string;
    name: string;
    price: number;
    description: string;
    mandatory?: boolean;
  }[];
  billingPeriod: "monthly" | "yearly";
}

export type PricingStrategy =
  | FlatRateStrategy
  | UsageBasedStrategy
  | TieredStrategy
  | PerUserStrategy
  | FreemiumStrategy
  | FeatureBasedStrategy;

export interface PricingConfiguration {
  strategies: PricingStrategy[];
  selectedStrategy?: string;
  comparisonMode: boolean;
}

export const STRATEGY_LABELS: Record<PricingStrategyType, string> = {
  "flat-rate": "Flat-Rate Pricing",
  "usage-based": "Usage-Based Pricing",
  tiered: "Tiered Pricing",
  "per-user": "Per-User Pricing",
  freemium: "Freemium + Paid Upgrades",
  "feature-based": "Feature-Based Pricing",
};

export const STRATEGY_DESCRIPTIONS: Record<PricingStrategyType, string> = {
  "flat-rate":
    "One price for the entire product, simple to communicate, best for single-product SaaS.",
  "usage-based":
    "Price is proportional to the customer's usage (e.g., API calls, storage, transactions).",
  tiered:
    "Multiple packages with different feature sets or usage limits (e.g., Basic, Pro, Enterprise).",
  "per-user": "Charges based on the number of active users or seats.",
  freemium:
    "Free base product with optional paid upgrades for premium features.",
  "feature-based":
    "Price scales with the features selected (customizable bundles).",
};
