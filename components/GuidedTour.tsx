"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Plus,
  Eye,
  BarChart3,
  Download,
  Sparkles,
} from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: "top" | "bottom" | "left" | "right";
  icon: React.ComponentType<{ className?: string }>;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to PricingCraft! 🎉",
    description: "Let's take a quick tour to help you get started with creating amazing pricing models for your SaaS.",
    target: "",
    position: "bottom",
    icon: Sparkles,
  },
  {
    id: "add-strategy",
    title: "Create Your First Model",
    description: "Start by adding a pricing model. Choose from tiered pricing, usage-based, freemium, and more models tailored for SaaS products.",
    target: '[data-tour="add-strategy-button"]',
    position: "right",
    icon: Plus,
  },
  {
    id: "canvas",
    title: "Live Preview Canvas",
    description: "This is your live preview area where you'll see your pricing page come to life. All changes update instantly as you configure your strategies.",
    target: '[data-tour="canvas"]',
    position: "right",
    icon: Eye,
  },
  {
    id: "comparison",
    title: "Model Comparison",
    description: "When you have multiple models, comparison tools appear here to help you analyze different pricing approaches side by side.",
    target: '[data-tour="comparison-button"]',
    position: "bottom",
    icon: BarChart3,
  },
  {
    id: "preview",
    title: "Preview Your Page",
    description: "Test how your pricing page looks on desktop, tablet, and mobile devices with our responsive preview modal.",
    target: '[data-tour="preview-button"]',
    position: "bottom",
    icon: Eye,
  },
  {
    id: "export",
    title: "Export Configuration",
    description: "Export your pricing configuration as JSON to save your work or integrate with your application.",
    target: '[data-tour="export-button"]',
    position: "bottom",
    icon: Download,
  },
];

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function GuidedTour({ isOpen, onClose, onComplete }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });

  const step = TOUR_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  useEffect(() => {
    if (!isOpen || !step.target) {
      setTargetElement(null);
      return;
    }

    const element = document.querySelector(step.target) as HTMLElement;
    if (element) {
      setTargetElement(element);
      const rect = element.getBoundingClientRect();
      setOverlayPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [isOpen, step.target, currentStep]);

  const nextStep = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getTooltipPosition = () => {
    if (!targetElement || !step.target) {
      // Welcome step - center on screen
      return {
        position: "fixed" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10001,
      };
    }

    const rect = targetElement.getBoundingClientRect();
    const tooltipOffset = 16;
    const tooltipWidth = 320; // Estimated tooltip width
    const tooltipHeight = 200; // Estimated tooltip height

    let style: React.CSSProperties = {
      position: "fixed",
      zIndex: 10001,
    };

    // Helper function to keep tooltip within viewport
    const clampToViewport = (value: number, min: number, max: number) => {
      return Math.max(min, Math.min(max, value));
    };

    switch (step.position) {
      case "top":
        style.bottom = window.innerHeight - rect.top + tooltipOffset;
        style.left = clampToViewport(
          rect.left + rect.width / 2,
          tooltipWidth / 2,
          window.innerWidth - tooltipWidth / 2
        );
        style.transform = "translateX(-50%)";
        // If tooltip would go off top of screen, switch to bottom
        if (rect.top - tooltipHeight - tooltipOffset < 0) {
          style.top = rect.bottom + tooltipOffset;
          delete style.bottom;
        }
        break;
      case "bottom":
        style.top = rect.bottom + tooltipOffset;
        style.left = clampToViewport(
          rect.left + rect.width / 2,
          tooltipWidth / 2,
          window.innerWidth - tooltipWidth / 2
        );
        style.transform = "translateX(-50%)";
        // If tooltip would go off bottom of screen, switch to top
        if (rect.bottom + tooltipHeight + tooltipOffset > window.innerHeight) {
          style.bottom = window.innerHeight - rect.top + tooltipOffset;
          delete style.top;
        }
        break;
      case "left":
        style.right = window.innerWidth - rect.left + tooltipOffset;
        style.top = clampToViewport(
          rect.top + rect.height / 2,
          tooltipHeight / 2,
          window.innerHeight - tooltipHeight / 2
        );
        style.transform = "translateY(-50%)";
        // If tooltip would go off left of screen, switch to right
        if (rect.left - tooltipWidth - tooltipOffset < 0) {
          style.left = rect.right + tooltipOffset;
          delete style.right;
        }
        break;
      case "right":
        style.left = rect.right + tooltipOffset;
        style.top = clampToViewport(
          rect.top + rect.height / 2,
          tooltipHeight / 2,
          window.innerHeight - tooltipHeight / 2
        );
        style.transform = "translateY(-50%)";
        // If tooltip would go off right of screen, switch to left
        if (rect.right + tooltipWidth + tooltipOffset > window.innerWidth) {
          style.right = window.innerWidth - rect.left + tooltipOffset;
          delete style.left;
        }
        break;
    }

    return style;
  };

  if (!isOpen) return null;

  const IconComponent = step.icon;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-10000"
        onClick={onClose}
      />

      {/* Highlight for targeted element */}
      {step.target && targetElement && (
        <div
          className="fixed z-10000 pointer-events-none"
          style={{
            top: overlayPosition.top - 4,
            left: overlayPosition.left - 4,
            width: overlayPosition.width + 8,
            height: overlayPosition.height + 8,
            border: "2px solid #3b82f6",
            borderRadius: "8px",
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
            animation: "pulse 2s infinite",
          }}
        />
      )}

      {/* Tooltip */}
      <Card
        className="w-80 shadow-2xl border-slate-200 bg-white"
        style={getTooltipPosition()}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <IconComponent className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                <Badge variant="outline" className="text-xs mt-1">
                  Step {currentStep + 1} of {TOUR_STEPS.length}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-slate-600 mb-6 leading-relaxed">
            {step.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {TOUR_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? "bg-primary" : "bg-slate-300"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {!isFirstStep && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
              )}
              <Button
                size="sm"
                onClick={nextStep}
                className="gap-2"
              >
                {isLastStep ? "Get Started" : "Next"}
                {!isLastStep && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  );
}