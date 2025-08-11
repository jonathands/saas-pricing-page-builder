import { 
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

interface FeatureDisplayProps {
  features: string[] | EnhancedFeature[];
  className?: string;
  iconColorClass?: string;
  style?: React.CSSProperties;
}

// Icon mapping (same as in FeatureEditor)
const ICON_MAP: Record<string, any> = {
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
};

export function FeatureDisplay({ 
  features, 
  className = "", 
  iconColorClass = "text-primary" 
}: FeatureDisplayProps) {
  // Convert legacy features to enhanced format for consistent rendering
  const enhancedFeatures: EnhancedFeature[] = Array.isArray(features)
    ? features.map((feature, index) => {
        if (typeof feature === "string") {
          return {
            id: `feature-${index}`,
            text: feature,
            icon: "Check",
            iconPosition: "before" as const,
          };
        }
        return feature;
      })
    : [];

  return (
    <ul className={`space-y-2 ${className}`}>
      {enhancedFeatures.map((feature, index) => {
        const IconComponent = ICON_MAP[feature.icon || "Check"] || Check;
        
        return (
          <li key={feature.id || index} className="flex items-center gap-2">
            {feature.iconPosition === "before" && (
              <IconComponent className={`w-4 h-4 flex-shrink-0 ${iconColorClass}`} />
            )}
            <span className="flex-1">{feature.text}</span>
            {feature.iconPosition === "after" && (
              <IconComponent className={`w-4 h-4 flex-shrink-0 ${iconColorClass}`} />
            )}
          </li>
        );
      })}
    </ul>
  );
}
