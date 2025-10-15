import { PricingModel, PricingModelType } from "@shared/pricing";

// Mock data templates for different model types
export const MODEL_TEMPLATES: Record<PricingModelType, Omit<PricingModel, 'id' | 'name'>> = {
  "flat-rate": {
    type: "flat-rate" as const,
    description: "Simple flat rate pricing model",
    price: 29,
    features: [
      {
        id: "1",
        text: "Core features",
        icon: "Star",
        iconPosition: "before",
      },
      {
        id: "2",
        text: "24/7 support",
        icon: "Headphones",
        iconPosition: "before",
      },
      {
        id: "3",
        text: "API access",
        icon: "Settings",
        iconPosition: "before",
      },
    ],
    billingPeriod: "monthly" as const,
  } as Omit<PricingModel, 'id' | 'name'>,
  "usage-based": {
    type: "usage-based" as const,
    description: "Pay for what you use",
    basePrice: 10,
    usagePrice: 0.05,
    usageUnit: "API calls",
    includedUsage: 1000,
    features: [
      {
        id: "1",
        text: "Base platform access",
        icon: "Cloud",
        iconPosition: "before",
      },
      {
        id: "2",
        text: "Real-time monitoring",
        icon: "BarChart3",
        iconPosition: "before",
      },
      {
        id: "3",
        text: "Usage analytics",
        icon: "Clock",
        iconPosition: "before",
      },
    ],
  } as Omit<PricingModel, 'id' | 'name'>,
  tiered: {
    type: "tiered" as const,
    description: "Multiple tiers for different needs",
    tiers: [
      {
        id: "basic",
        name: "Basic",
        price: 19,
        features: [
          {
            id: "1",
            text: "5 projects",
            icon: "Package",
            iconPosition: "before",
          },
          {
            id: "2",
            text: "Basic support",
            icon: "Mail",
            iconPosition: "before",
          },
        ],
        billingPeriod: "monthly" as const,
      },
      {
        id: "pro",
        name: "Pro",
        price: 49,
        features: [
          {
            id: "1",
            text: "25 projects",
            icon: "Package",
            iconPosition: "before",
          },
          {
            id: "2",
            text: "Priority support",
            icon: "Headphones",
            iconPosition: "before",
          },
          {
            id: "3",
            text: "Advanced features",
            icon: "Zap",
            iconPosition: "before",
          },
        ],
        billingPeriod: "monthly" as const,
        popular: true,
      },
      {
        id: "enterprise",
        name: "Enterprise",
        price: 149,
        features: [
          {
            id: "1",
            text: "Unlimited projects",
            icon: "Package",
            iconPosition: "before",
          },
          {
            id: "2",
            text: "Dedicated support",
            icon: "Shield",
            iconPosition: "before",
          },
          {
            id: "3",
            text: "Custom integrations",
            icon: "Globe",
            iconPosition: "before",
          },
        ],
        billingPeriod: "monthly" as const,
      },
    ],
  } as Omit<PricingModel, 'id' | 'name'>,
  "per-user": {
    type: "per-user" as const,
    description: "Pricing per team member",
    pricePerUser: 15,
    minimumUsers: 3,
    features: [
      {
        id: "1",
        text: "Per-user workspaces",
        icon: "Users",
        iconPosition: "before",
      },
      {
        id: "2",
        text: "Team collaboration",
        icon: "Users",
        iconPosition: "before",
      },
      {
        id: "3",
        text: "Admin controls",
        icon: "Shield",
        iconPosition: "before",
      },
    ],
    billingPeriod: "monthly" as const,
  } as Omit<PricingModel, 'id' | 'name'>,
  freemium: {
    type: "freemium" as const,
    description: "Free tier with premium options",
    freeTier: {
      features: [
        { id: "1", text: "1 project", icon: "Package", iconPosition: "before" },
        {
          id: "2",
          text: "Basic features",
          icon: "Star",
          iconPosition: "before",
        },
        {
          id: "3",
          text: "Community support",
          icon: "Users",
          iconPosition: "before",
        },
      ],
      usageLimit: 100,
    },
    paidTiers: [
      {
        id: "starter",
        name: "Starter",
        price: 9,
        features: [
          {
            id: "1",
            text: "5 projects",
            icon: "Package",
            iconPosition: "before",
          },
          {
            id: "2",
            text: "Premium features",
            icon: "Zap",
            iconPosition: "before",
          },
        ],
        usageLimit: 1000,
        billingPeriod: "monthly" as const,
      },
      {
        id: "professional",
        name: "Professional",
        price: 29,
        features: [
          {
            id: "1",
            text: "Unlimited projects",
            icon: "Package",
            iconPosition: "before",
          },
          {
            id: "2",
            text: "All features",
            icon: "Star",
            iconPosition: "before",
          },
          {
            id: "3",
            text: "Priority support",
            icon: "Headphones",
            iconPosition: "before",
          },
        ],
        billingPeriod: "monthly" as const,
      },
    ],
  } as Omit<PricingModel, 'id' | 'name'>,
  "feature-based": {
    type: "feature-based" as const,
    description: "Pay only for features you need",
    basePrice: 19,
    features: [
      {
        id: "analytics",
        name: "Advanced Analytics",
        price: 10,
        description: "Detailed reporting and insights",
      },
      {
        id: "api",
        name: "API Access",
        price: 15,
        description: "Full REST API access",
      },
      {
        id: "integrations",
        name: "Third-party Integrations",
        price: 20,
        description: "Connect with external tools",
      },
      {
        id: "whitelabel",
        name: "White-label",
        price: 50,
        description: "Remove branding and customize",
      },
    ],
    billingPeriod: "monthly" as const,
  } as Omit<PricingModel, 'id' | 'name'>,
};

export class ModelService {
  static generateId(): string {
    return `model-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static createModel(type: PricingModelType, name: string): PricingModel {
    const template = MODEL_TEMPLATES[type];
    return {
      ...template,
      id: this.generateId(),
      name,
      type,
    } as PricingModel;
  }

  static getTemplate(type: PricingModelType) {
    return MODEL_TEMPLATES[type];
  }

  static getDefaultName(type: PricingModelType): string {
    const names: Record<PricingModelType, string> = {
      "flat-rate": "Simple Plan",
      "usage-based": "Pay as you Scale",
      "tiered": "Growth Plans",
      "per-user": "Team Plan",
      "freemium": "Freemium Model",
      "feature-based": "Custom Bundle",
    };
    return names[type];
  }
}