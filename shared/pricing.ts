/**
 * Shared types for SaaS pricing models
 */

export interface EnhancedFeature {
  id: string;
  text: string;
  icon?: string;
  iconPosition?: "before" | "after";
}

export type PricingModelType =
  | "flat-rate"
  | "usage-based"
  | "tiered"
  | "per-user"
  | "freemium"
  | "feature-based";

export interface BasePricingModel {
  id: string;
  type: PricingStrategyType;
  name: string;
  description: string;
}

export interface FlatRateModel extends BasePricingModel {
  type: "flat-rate";
  price: number;
  features: string[] | EnhancedFeature[];
  billingPeriod: "monthly" | "yearly";
}

export interface UsageBasedModel extends BasePricingModel {
  type: "usage-based";
  basePrice: number;
  usagePrice: number;
  usageUnit: string;
  includedUsage: number;
  features: string[] | EnhancedFeature[];
}

export interface TieredModel extends BasePricingModel {
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

export interface PerUserModel extends BasePricingModel {
  type: "per-user";
  pricePerUser: number;
  minimumUsers: number;
  features: string[] | EnhancedFeature[];
  billingPeriod: "monthly" | "yearly";
}

export interface FreemiumModel extends BasePricingModel {
  type: "freemium";
  freeTier: {
    features: string[] | EnhancedFeature[];
    usageLimit?: number;
  };
  paidTiers: {
    id: string;
    name: string;
    price: number;
    features: string[] | EnhancedFeature[];
    usageLimit?: number;
    billingPeriod: "monthly" | "yearly";
  }[];
}

export interface FeatureBasedModel extends BasePricingModel {
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

export type PricingModel =
  | FlatRateModel
  | UsageBasedModel
  | TieredModel
  | PerUserModel
  | FreemiumModel
  | FeatureBasedModel;

export interface PricingConfiguration {
  models: PricingModel[];
  selectedModel?: string;
  comparisonMode: boolean;
}

export const MODEL_LABELS: Record<PricingModelType, string> = {
  "flat-rate": "Flat-Rate Pricing",
  "usage-based": "Usage-Based Pricing",
  tiered: "Tiered Pricing",
  "per-user": "Per-User Pricing",
  freemium: "Freemium + Paid Upgrades",
  "feature-based": "Feature-Based Pricing",
};

export const MODEL_DESCRIPTIONS: Record<PricingModelType, string> = {
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
