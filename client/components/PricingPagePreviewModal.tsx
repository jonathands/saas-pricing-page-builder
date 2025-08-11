import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Monitor, Tablet, Smartphone, X } from "lucide-react";
import { PricingPagePreview } from "@/components/PricingPagePreview";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PricingStrategy } from "@shared/pricing";

interface PricingPagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategies: PricingStrategy[];
}

const SCREEN_SIZES = {
  desktop: {
    name: "Desktop",
    icon: Monitor,
    width: "1200px",
    height: "800px",
    description: "1200×800",
  },
  tablet: {
    name: "Tablet",
    icon: Tablet,
    width: "768px",
    height: "1024px",
    description: "768×1024",
  },
  mobile: {
    name: "Mobile",
    icon: Smartphone,
    width: "375px",
    height: "667px",
    description: "375×667",
  },
};

export function PricingPagePreviewModal({
  isOpen,
  onClose,
  strategies,
}: PricingPagePreviewModalProps) {
  const [selectedSize, setSelectedSize] =
    useState<keyof typeof SCREEN_SIZES>("desktop");

  if (!isOpen) return null;

  const currentSize = SCREEN_SIZES[selectedSize];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[95vw] max-h-[95vh] h-full p-0 gap-0 bg-slate-900 border-slate-700"
        style={{ fontFamily: '"Open Sans", sans-serif' }}
      >
        <DialogHeader className="p-6 pb-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-slate-100">
                Pricing Page Preview
              </DialogTitle>
              <p className="text-sm text-slate-300 mt-1">
                See how your pricing page looks across different devices
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Screen Size Selector */}
          <div className="mt-4">
            <Tabs
              value={selectedSize}
              onValueChange={(value: any) => setSelectedSize(value)}
            >
              <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-600">
                {Object.entries(SCREEN_SIZES).map(([key, size]) => {
                  const Icon = size.icon;
                  return (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="flex items-center gap-2 text-slate-300 data-[state=active]:text-slate-100 data-[state=active]:bg-slate-700"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{size.name}</span>
                      <Badge
                        variant="outline"
                        className="text-xs hidden md:inline border-slate-600 text-slate-400"
                      >
                        {size.description}
                      </Badge>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>
        </DialogHeader>

        {/* Preview Container */}
        <div className="flex-1 p-6 bg-slate-800 overflow-hidden">
          <div className="h-full flex items-center justify-center">
            <div
              className="bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-600"
              style={{
                width: currentSize.width,
                height: currentSize.height,
                maxWidth: "100%",
                maxHeight: "100%",
                transition: "all 0.3s ease-in-out",
              }}
            >
              {/* Preview Header */}
              <div className="bg-slate-100 border-b px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 text-center text-sm text-slate-600">
                  yourapp.com/pricing
                </div>
                <Badge variant="outline" className="text-xs border-slate-300 text-slate-600">
                  {currentSize.name}
                </Badge>
              </div>

              {/* Preview Content */}
              <div className="h-[calc(100%-48px)] overflow-auto">
                <div
                  style={{
                    transform:
                      selectedSize === "mobile"
                        ? "scale(0.85)"
                        : selectedSize === "tablet"
                          ? "scale(0.9)"
                          : "scale(1)",
                    transformOrigin: "top left",
                    width:
                      selectedSize === "mobile"
                        ? "118%"
                        : selectedSize === "tablet"
                          ? "111%"
                          : "100%",
                  }}
                >
                  <ThemeProvider>
                    <PricingPagePreview strategies={strategies} />
                  </ThemeProvider>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 p-4 bg-slate-800">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center gap-4">
              <span>
                Current view: {currentSize.name} ({currentSize.description})
              </span>
              {strategies.length > 0 && (
                <span>
                  {strategies.length} strateg
                  {strategies.length === 1 ? "y" : "ies"} configured
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                Use tabs above to switch between device sizes
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
