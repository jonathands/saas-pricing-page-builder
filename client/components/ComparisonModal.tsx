import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ComparisonTable, CostChart } from "@/components/ComparisonComponents";
import { useTheme } from "@/contexts/ThemeContext";
import { PricingStrategy } from "@shared/pricing";
import { BarChart3, X, Printer } from "lucide-react";

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategies: PricingStrategy[];
}

export function ComparisonModal({
  isOpen,
  onClose,
  strategies,
}: ComparisonModalProps) {
  const { theme } = useTheme();

  if (strategies.length < 2) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-100">
              <BarChart3 className="w-5 h-5" />
              Strategy Comparison
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              Compare your pricing strategies side by side
            </DialogDescription>
          </DialogHeader>
          
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">
              Need More Strategies
            </h3>
            <p className="text-slate-400 mb-4">
              Add at least 2 pricing strategies to see detailed comparisons and analysis.
            </p>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-slate-600 text-slate-200 hover:bg-slate-800"
            >
              Add More Strategies
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 print:bg-white print:border-gray-300 print:text-black print:max-w-none print:max-h-none print:overflow-visible">
        <DialogHeader className="print:border-b print:border-gray-300 print:pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-slate-100">
                <BarChart3 className="w-5 h-5" />
                Strategy Comparison
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                Compare your pricing strategies side by side with detailed analytics
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 print:hidden"
              >
                <Printer className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 print:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6 print:mt-4">
          {/* Strategy Overview */}
          <div className="text-center space-y-2 print:text-left">
            <h2
              className="text-xl font-bold print:text-2xl print:text-black print:mb-2"
              style={{
                fontFamily: `var(--font-header, ${theme.headerFont})`,
                color: theme.primaryColor
              }}
            >
              Comparing {strategies.length} Strategies
            </h2>
            <p
              className="text-sm print:text-base print:text-gray-700"
              style={{
                fontFamily: `var(--font-text, ${theme.textFont})`,
                color: 'hsl(var(--muted-foreground))'
              }}
            >
              Analyze and compare the key metrics, scalability, and cost structures
            </p>
            <div className="print:block hidden text-sm text-gray-500 mt-4">
              Generated on {new Date().toLocaleDateString()} - PricingCraft Strategy Analysis
            </div>
          </div>

          {/* Comparison Table */}
          <div className="space-y-4 print:space-y-6">
            <div className="print:break-inside-avoid">
              <h3
                className="text-lg font-semibold mb-3 print:text-xl print:text-black print:border-b print:border-gray-300 print:pb-2"
                style={{
                  fontFamily: `var(--font-header, ${theme.headerFont})`,
                  color: theme.primaryColor
                }}
              >
                Strategy Comparison Matrix
              </h3>
              <div className="overflow-x-auto print:overflow-visible">
                <ComparisonTable strategies={strategies} />
              </div>
            </div>

            <Separator className="bg-slate-700 print:bg-gray-300 print:my-6" />

            <div className="print:break-inside-avoid">
              <h3
                className="text-lg font-semibold mb-3 print:text-xl print:text-black print:border-b print:border-gray-300 print:pb-2"
                style={{
                  fontFamily: `var(--font-header, ${theme.headerFont})`,
                  color: theme.primaryColor
                }}
              >
                Cost Analysis Chart
              </h3>
              <CostChart strategies={strategies} />
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 print:bg-gray-50 print:border-gray-300 print:break-inside-avoid">
            <h4
              className="font-semibold mb-3 print:text-black print:border-b print:border-gray-300 print:pb-2"
              style={{
                fontFamily: `var(--font-header, ${theme.headerFont})`,
                color: theme.primaryColor
              }}
            >
              Key Insights
            </h4>
            <ul className="space-y-2 text-sm text-slate-300 print:text-gray-700 print:space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0 print:bg-gray-400" />
                <span>
                  <strong>Usage-based</strong> strategies scale best with high-volume customers
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0 print:bg-gray-400" />
                <span>
                  <strong>Tiered</strong> plans offer predictable revenue and suit most business sizes
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0 print:bg-gray-400" />
                <span>
                  <strong>Flat-rate</strong> pricing provides simplicity but limited scalability
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0 print:bg-gray-400" />
                <span>
                  <strong>Per-user</strong> models grow linearly with team expansion
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700 print:hidden">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="border-slate-600 text-slate-200 hover:bg-slate-800"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Report
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-slate-600 text-slate-200 hover:bg-slate-800"
            >
              Close Comparison
            </Button>
            <Button
              onClick={() => {
                // Export comparison data
                const data = {
                  strategies: strategies.map(s => ({
                    name: s.name,
                    type: s.type,
                    // Add more strategy details for export
                  })),
                  exportedAt: new Date().toISOString(),
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], {
                  type: 'application/json'
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'pricing-comparison.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="bg-primary hover:bg-primary/90"
            >
              Export Comparison
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
