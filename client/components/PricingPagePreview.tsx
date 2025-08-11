import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  Star,
  Shield,
  Zap,
  ArrowRight,
  CreditCard,
  Lock,
  ChevronLeft,
  Plus,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { FeatureDisplay } from "@/components/FeatureDisplay";
import {
  PricingStrategy,
  FlatRateStrategy,
  TieredStrategy,
  UsageBasedStrategy,
  PerUserStrategy,
  FreemiumStrategy,
  FeatureBasedStrategy,
} from "@shared/pricing";

interface MockCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: any;
  strategy: PricingStrategy;
}

function MockCheckout({
  isOpen,
  onClose,
  selectedPlan,
  strategy,
}: MockCheckoutProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    company: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    // Mock completion
    alert("🎉 Mock checkout completed! This is a demonstration.");
    onClose();
    setStep(1);
    setFormData({
      email: "",
      name: "",
      company: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      billingAddress: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Secure Checkout - {selectedPlan?.name || "Plan"}
          </DialogTitle>
          <DialogDescription>
            This is a mock checkout process for demonstration purposes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNum <= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stepNum < step ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div
                    className={`w-12 h-0.5 ${stepNum < step ? "bg-primary" : "bg-muted"}`}
                  />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Account Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Acme Inc."
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment Information</h3>
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) =>
                    handleInputChange("cardNumber", e.target.value)
                  }
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      handleInputChange("expiryDate", e.target.value)
                    }
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                    placeholder="123"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="billingAddress">Billing Address</Label>
                <Input
                  id="billingAddress"
                  value={formData.billingAddress}
                  onChange={(e) =>
                    handleInputChange("billingAddress", e.target.value)
                  }
                  placeholder="123 Main St, City, State, ZIP"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      {selectedPlan?.name} Plan
                    </span>
                    <span className="font-bold">${selectedPlan?.price}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {strategy.type === "tiered"
                      ? "Monthly subscription"
                      : strategy.type === "per-user"
                        ? `Per user/month`
                        : strategy.type === "usage-based"
                          ? "Base price + usage"
                          : "Monthly"}
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between items-center font-bold">
                    <span>Total</span>
                    <span>${selectedPlan?.price}/mo</span>
                  </div>
                </CardContent>
              </Card>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> This is a demonstration checkout. No
                  actual payment will be processed.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={step === 1 ? onClose : handleBack}
            >
              {step === 1 ? (
                "Cancel"
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </>
              )}
            </Button>
            <Button onClick={step === 3 ? handleComplete : handleNext}>
              {step === 3 ? (
                <>
                  Complete Order
                  <CreditCard className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PricingPagePreview({
  strategies,
}: {
  strategies: PricingStrategy[];
}) {
  const { theme } = useTheme();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedStrategy, setSelectedStrategy] =
    useState<PricingStrategy | null>(null);

  const handleGetStarted = (plan: any, strategy: PricingStrategy) => {
    setSelectedPlan(plan);
    setSelectedStrategy(strategy);
    setCheckoutOpen(true);
  };

  if (strategies.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <CreditCard className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              No pricing strategies
            </h3>
            <p className="text-muted-foreground">
              Add a pricing strategy to see the pricing page preview
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.backgroundColor} p-8`}
      style={{
        fontFamily: `var(--font-text, ${theme.textFont})`,
      }}
    >
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h1
          className="text-5xl font-bold mb-6"
          style={{ 
            fontFamily: `var(--font-header, ${theme.headerFont})`,
            color: theme.primaryColor
          }}
        >
          Choose Your Perfect Plan
        </h1>
        <p 
          className="text-xl max-w-2xl mx-auto"
          style={{
            fontFamily: `var(--font-text, ${theme.textFont})`,
            color: 'hsl(var(--muted-foreground))'
          }}
        >
          Join thousands of businesses who trust our platform to grow their
          revenue. Start with a plan that fits your needs and scale as you grow.
        </p>

        {/* Trust indicators */}
        <div 
          className="flex items-center justify-center gap-8 mt-8 text-sm"
          style={{
            fontFamily: `var(--font-text, ${theme.textFont})`,
            color: 'hsl(var(--muted-foreground))'
          }}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" style={{ color: theme.primaryColor }} />
            <span>Enterprise Security</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" style={{ color: theme.primaryColor }} />
            <span>99.9% Uptime</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" style={{ color: theme.primaryColor }} />
            <span>5-star Support</span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto space-y-16">
        {strategies.map((strategy) => (
          <div key={strategy.id} className="space-y-8">
            <div className="text-center">
              <h2
                className="text-3xl font-bold mb-2"
                style={{
                  fontFamily: `var(--font-header, ${theme.headerFont})`,
                  color: theme.primaryColor
                }}
              >
                {strategy.name}
              </h2>
              <p 
                style={{
                  fontFamily: `var(--font-text, ${theme.textFont})`,
                  color: 'hsl(var(--muted-foreground))'
                }}
              >
                {strategy.description}
              </p>
            </div>

            {strategy.type === "flat-rate" && (
              <FlatRatePricingCard
                strategy={strategy as FlatRateStrategy}
                onGetStarted={handleGetStarted}
                theme={theme}
              />
            )}

            {strategy.type === "tiered" && (
              <TieredPricingCards
                strategy={strategy as TieredStrategy}
                onGetStarted={handleGetStarted}
                theme={theme}
              />
            )}

            {strategy.type === "usage-based" && (
              <UsageBasedPricingCard
                strategy={strategy as UsageBasedStrategy}
                onGetStarted={handleGetStarted}
                theme={theme}
              />
            )}

            {strategy.type === "per-user" && (
              <PerUserPricingCard
                strategy={strategy as PerUserStrategy}
                onGetStarted={handleGetStarted}
                theme={theme}
              />
            )}

            {strategy.type === "freemium" && (
              <FreemiumPricingCards
                strategy={strategy as FreemiumStrategy}
                onGetStarted={handleGetStarted}
                theme={theme}
              />
            )}

            {strategy.type === "feature-based" && (
              <FeatureBasedPricingCard
                strategy={strategy as FeatureBasedStrategy}
                onGetStarted={handleGetStarted}
                theme={theme}
              />
            )}
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="text-center mt-20 max-w-2xl mx-auto">
        <h3
          className="text-2xl font-bold mb-4"
          style={{ 
            fontFamily: `var(--font-header, ${theme.headerFont})`,
            color: theme.primaryColor
          }}
        >
          Questions? We're here to help
        </h3>
        <p 
          className="mb-6"
          style={{
            fontFamily: `var(--font-text, ${theme.textFont})`,
            color: 'hsl(var(--muted-foreground))'
          }}
        >
          Get in touch with our sales team to find the perfect plan for your
          business needs.
        </p>
        <Button
          variant="outline"
          size="lg"
          style={{ 
            fontFamily: `var(--font-button, ${theme.buttonFont})`,
            borderColor: theme.primaryColor,
            color: theme.primaryColor
          }}
          className="hover:bg-primary/10"
        >
          Contact Sales
        </Button>
      </div>

      <MockCheckout
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        selectedPlan={selectedPlan}
        strategy={selectedStrategy!}
      />
    </div>
  );
}

function FlatRatePricingCard({ strategy, onGetStarted, theme }: any) {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md" style={{ borderColor: theme.secondaryColor }}>
        <CardHeader className="text-center">
          <CardTitle
            className="text-2xl"
            style={{ fontFamily: `var(--font-header, ${theme.headerFont})` }}
          >
            {strategy.name}
          </CardTitle>
          <div className="space-y-2">
            <div
              className="text-4xl font-bold"
              style={{
                fontFamily: `var(--font-header, ${theme.headerFont})`,
                color: theme.primaryColor
              }}
            >
              ${strategy.price}
            </div>
            <div
              style={{
                fontFamily: `var(--font-text, ${theme.textFont})`,
                color: 'hsl(var(--muted-foreground))'
              }}
            >
              per {strategy.billingPeriod}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <FeatureDisplay
            features={strategy.features}
            iconColorClass="text-primary"
            className="space-y-3"
            style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
          />
          <Button
            className="w-full"
            size="lg"
            onClick={() => onGetStarted(strategy, strategy)}
            style={{ 
              fontFamily: `var(--font-button, ${theme.buttonFont})`,
              backgroundColor: theme.primaryColor,
              borderColor: theme.primaryColor
            }}
          >
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function TieredPricingCards({ strategy, onGetStarted, theme }: any) {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {strategy.tiers.map((tier: any) => (
        <Card
          key={tier.id}
          className={`relative ${tier.popular ? "scale-105" : ""}`}
          style={{ 
            borderColor: tier.popular ? theme.primaryColor : theme.secondaryColor,
            borderWidth: tier.popular ? '2px' : '1px'
          }}
        >
          {tier.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge 
                className="px-4 py-1"
                style={{ 
                  backgroundColor: theme.primaryColor,
                  color: 'white',
                  fontFamily: `var(--font-text, ${theme.textFont})`
                }}
              >
                Most Popular
              </Badge>
            </div>
          )}
          <CardHeader className="text-center">
            <CardTitle 
              className="text-xl"
              style={{ fontFamily: `var(--font-header, ${theme.headerFont})` }}
            >
              {tier.name}
            </CardTitle>
            <div className="space-y-2">
              <div 
                className="text-3xl font-bold"
                style={{ 
                  fontFamily: `var(--font-header, ${theme.headerFont})`,
                  color: theme.primaryColor
                }}
              >
                ${tier.price}
              </div>
              <div 
                style={{
                  fontFamily: `var(--font-text, ${theme.textFont})`,
                  color: 'hsl(var(--muted-foreground))'
                }}
              >
                per {tier.billingPeriod}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <FeatureDisplay
              features={tier.features}
              iconColorClass="text-primary"
              className="space-y-3"
              style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
            />
            <Button
              className="w-full"
              size="lg"
              variant={tier.popular ? "default" : "outline"}
              onClick={() => onGetStarted(tier, strategy)}
              style={tier.popular ? {
                fontFamily: `var(--font-button, ${theme.buttonFont})`,
                backgroundColor: theme.primaryColor,
                borderColor: theme.primaryColor
              } : {
                fontFamily: `var(--font-button, ${theme.buttonFont})`,
                borderColor: theme.primaryColor,
                color: theme.primaryColor
              }}
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function UsageBasedPricingCard({ strategy, onGetStarted, theme }: any) {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md" style={{ borderColor: theme.secondaryColor }}>
        <CardHeader className="text-center">
          <CardTitle 
            className="text-2xl"
            style={{ fontFamily: `var(--font-header, ${theme.headerFont})` }}
          >
            {strategy.name}
          </CardTitle>
          <div className="space-y-2">
            <div 
              className="text-4xl font-bold"
              style={{ 
                fontFamily: `var(--font-header, ${theme.headerFont})`,
                color: theme.primaryColor
              }}
            >
              ${strategy.basePrice}
            </div>
            <div 
              style={{
                fontFamily: `var(--font-text, ${theme.textFont})`,
                color: 'hsl(var(--muted-foreground))'
              }}
            >
              base + ${strategy.usagePrice} per {strategy.usageUnit}
            </div>
            <div 
              className="text-sm"
              style={{
                fontFamily: `var(--font-text, ${theme.textFont})`,
                color: 'hsl(var(--muted-foreground))'
              }}
            >
              Includes {strategy.includedUsage.toLocaleString()}{" "}
              {strategy.usageUnit}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <FeatureDisplay
            features={strategy.features}
            iconColorClass="text-primary"
            className="space-y-3"
            style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
          />
          <Button
            className="w-full"
            size="lg"
            onClick={() => onGetStarted(strategy, strategy)}
            style={{ 
              fontFamily: `var(--font-button, ${theme.buttonFont})`,
              backgroundColor: theme.primaryColor,
              borderColor: theme.primaryColor
            }}
          >
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function PerUserPricingCard({ strategy, onGetStarted, theme }: any) {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md" style={{ borderColor: theme.secondaryColor }}>
        <CardHeader className="text-center">
          <CardTitle
            className="text-2xl"
            style={{ fontFamily: `var(--font-header, ${theme.headerFont})` }}
          >
            {strategy.name}
          </CardTitle>
          <div className="space-y-2">
            <div
              className="text-4xl font-bold"
              style={{
                fontFamily: `var(--font-header, ${theme.headerFont})`,
                color: theme.primaryColor
              }}
            >
              ${strategy.pricePerUser}
            </div>
            <div
              style={{
                fontFamily: `var(--font-text, ${theme.textFont})`,
                color: 'hsl(var(--muted-foreground))'
              }}
            >
              per user / {strategy.billingPeriod}
            </div>
            <div
              className="text-sm"
              style={{
                fontFamily: `var(--font-text, ${theme.textFont})`,
                color: 'hsl(var(--muted-foreground))'
              }}
            >
              Minimum {strategy.minimumUsers} users
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <FeatureDisplay
            features={strategy.features}
            iconColorClass="text-primary"
            className="space-y-3"
            style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
          />
          <Button
            className="w-full"
            size="lg"
            onClick={() => onGetStarted(strategy, strategy)}
            style={{
              fontFamily: `var(--font-button, ${theme.buttonFont})`,
              backgroundColor: theme.primaryColor,
              borderColor: theme.primaryColor
            }}
          >
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function FreemiumPricingCards({ strategy, onGetStarted, theme }: any) {
  const allTiers = [
    {
      id: "free",
      name: "Free",
      price: 0,
      features: strategy.freeTier.features,
      usageLimit: strategy.freeTier.usageLimit,
      billingPeriod: "monthly" as const,
      isFree: true,
    },
    ...strategy.paidTiers.map((tier: any) => ({ ...tier, isFree: false })),
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {allTiers.map((tier: any) => (
        <Card
          key={tier.id}
          className={`relative ${tier.isFree ? "border-green-500" : ""}`}
          style={{
            borderColor: tier.isFree ? "#22c55e" : theme.secondaryColor,
            borderWidth: tier.isFree ? '2px' : '1px'
          }}
        >
          {tier.isFree && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge
                className="px-4 py-1"
                style={{
                  backgroundColor: "#22c55e",
                  color: 'white',
                  fontFamily: `var(--font-text, ${theme.textFont})`
                }}
              >
                Free Forever
              </Badge>
            </div>
          )}
          <CardHeader className="text-center">
            <CardTitle
              className="text-xl"
              style={{
                fontFamily: `var(--font-header, ${theme.headerFont})`,
                color: tier.isFree ? "#22c55e" : undefined
              }}
            >
              {tier.name}
            </CardTitle>
            <div className="space-y-2">
              <div
                className="text-3xl font-bold"
                style={{
                  fontFamily: `var(--font-header, ${theme.headerFont})`,
                  color: tier.isFree ? "#22c55e" : theme.primaryColor
                }}
              >
                {tier.isFree ? 'Free' : `$${tier.price}`}
              </div>
              {!tier.isFree && (
                <div
                  style={{
                    fontFamily: `var(--font-text, ${theme.textFont})`,
                    color: 'hsl(var(--muted-foreground))'
                  }}
                >
                  per {tier.billingPeriod === "monthly" ? "month" : "year"}
                </div>
              )}
              {tier.usageLimit && (
                <div
                  className="text-sm"
                  style={{
                    fontFamily: `var(--font-text, ${theme.textFont})`,
                    color: 'hsl(var(--muted-foreground))'
                  }}
                >
                  {tier.usageLimit} {tier.isFree ? 'usage limit' : 'included'}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <FeatureDisplay
              features={tier.features}
              iconColorClass={tier.isFree ? "text-green-500" : "text-primary"}
              className="space-y-3"
              style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
            />
            <Button
              className="w-full"
              size="lg"
              variant={tier.isFree ? "default" : "outline"}
              onClick={() => onGetStarted(tier, strategy)}
              style={tier.isFree ? {
                fontFamily: `var(--font-button, ${theme.buttonFont})`,
                backgroundColor: "#22c55e",
                borderColor: "#22c55e"
              } : {
                fontFamily: `var(--font-button, ${theme.buttonFont})`,
                borderColor: theme.primaryColor,
                color: theme.primaryColor
              }}
            >
              {tier.isFree ? 'Get Started Free' : 'Upgrade Now'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FeatureBasedPricingCard({ strategy, onGetStarted, theme }: any) {
  const mandatoryFeatures = strategy.features.filter((f: any) => f.mandatory);
  const optionalFeatures = strategy.features.filter((f: any) => !f.mandatory);
  const mandatoryTotal = mandatoryFeatures.reduce((sum: number, f: any) => sum + f.price, 0);
  const totalPrice = strategy.basePrice + mandatoryTotal;

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Main Pricing Card */}
      <Card className="w-full" style={{ borderColor: theme.secondaryColor }}>
        <CardHeader className="text-center">
          <CardTitle
            className="text-2xl"
            style={{ fontFamily: `var(--font-header, ${theme.headerFont})` }}
          >
            {strategy.name}
          </CardTitle>
          <div className="space-y-2">
            <div
              className="text-4xl font-bold"
              style={{
                fontFamily: `var(--font-header, ${theme.headerFont})`,
                color: theme.primaryColor
              }}
            >
              From ${totalPrice}
            </div>
            <div
              style={{
                fontFamily: `var(--font-text, ${theme.textFont})`,
                color: 'hsl(var(--muted-foreground))'
              }}
            >
              per {strategy.billingPeriod === "monthly" ? "month" : "year"}
            </div>
            <div
              className="text-sm"
              style={{
                fontFamily: `var(--font-text, ${theme.textFont})`,
                color: 'hsl(var(--muted-foreground))'
              }}
            >
              Base price: ${strategy.basePrice}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Base Package */}
          <div>
            <h4
              className="font-semibold text-sm mb-3"
              style={{
                fontFamily: `var(--font-text, ${theme.textFont})`,
                color: theme.primaryColor
              }}
            >
              Base Package
            </h4>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div
                className="text-sm font-medium"
                style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
              >
                ${strategy.basePrice}/
                {strategy.billingPeriod === "monthly" ? "month" : "year"}
              </div>
              <div
                className="text-xs"
                style={{
                  fontFamily: `var(--font-text, ${theme.textFont})`,
                  color: 'hsl(var(--muted-foreground))'
                }}
              >
                Core platform access
              </div>
            </div>
          </div>

          {/* Mandatory Features */}
          {mandatoryFeatures.length > 0 && (
            <div>
              <h4
                className="font-semibold text-sm mb-3 flex items-center gap-2"
                style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
              >
                <Badge
                  className="text-xs"
                  style={{
                    backgroundColor: '#ea580c',
                    color: 'white',
                    fontFamily: `var(--font-text, ${theme.textFont})`
                  }}
                >
                  Required
                </Badge>
                Included Features
              </h4>
              <ul className="space-y-2">
                {mandatoryFeatures.map((feature: any, index: number) => (
                  <li
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: theme.primaryColor }} />
                      <span style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}>
                        {feature.name}
                      </span>
                    </div>
                    <span
                      className="font-medium"
                      style={{
                        color: '#16a34a',
                        fontFamily: `var(--font-text, ${theme.textFont})`
                      }}
                    >
                      +${feature.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            onClick={() => onGetStarted(strategy, strategy)}
            style={{
              fontFamily: `var(--font-button, ${theme.buttonFont})`,
              backgroundColor: theme.primaryColor,
              borderColor: theme.primaryColor
            }}
          >
            Start Customizing
          </Button>
        </CardContent>
      </Card>

      {/* Feature Breakdown Card */}
      <Card className="w-full" style={{ borderColor: theme.secondaryColor }}>
        <CardHeader>
          <CardTitle
            className="text-lg"
            style={{ fontFamily: `var(--font-header, ${theme.headerFont})` }}
          >
            Build Your Package
          </CardTitle>
          <CardDescription
            style={{
              fontFamily: `var(--font-text, ${theme.textFont})`,
              color: 'hsl(var(--muted-foreground))'
            }}
          >
            Customize your plan with the features you need
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span
                className="font-medium"
                style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
              >
                Base Package
              </span>
              <span
                className="font-bold"
                style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
              >
                ${strategy.basePrice}
              </span>
            </div>

            {mandatoryFeatures.map((feature: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 border rounded"
              >
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" style={{ color: '#16a34a' }} />
                  <div>
                    <div
                      className="font-medium text-sm"
                      style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
                    >
                      {feature.name}
                    </div>
                    <div
                      className="text-xs"
                      style={{
                        fontFamily: `var(--font-text, ${theme.textFont})`,
                        color: 'hsl(var(--muted-foreground))'
                      }}
                    >
                      Required
                    </div>
                  </div>
                </div>
                <span
                  className="font-medium"
                  style={{
                    color: '#16a34a',
                    fontFamily: `var(--font-text, ${theme.textFont})`
                  }}
                >
                  +${feature.price}
                </span>
              </div>
            ))}

            {optionalFeatures.map((feature: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 border border-dashed rounded"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 border rounded-sm flex items-center justify-center"
                    style={{ borderColor: 'hsl(var(--muted-foreground))' }}
                  >
                    <Star className="w-3 h-3" style={{ color: 'hsl(var(--muted-foreground))' }} />
                  </div>
                  <div>
                    <div
                      className="font-medium text-sm"
                      style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
                    >
                      {feature.name}
                    </div>
                    <div
                      className="text-xs"
                      style={{
                        fontFamily: `var(--font-text, ${theme.textFont})`,
                        color: 'hsl(var(--muted-foreground))'
                      }}
                    >
                      Optional
                    </div>
                  </div>
                </div>
                <span
                  className="font-medium"
                  style={{
                    fontFamily: `var(--font-text, ${theme.textFont})`,
                    color: 'hsl(var(--muted-foreground))'
                  }}
                >
                  +${feature.price}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3">
            <div
              className="flex justify-between items-center font-bold"
              style={{ fontFamily: `var(--font-text, ${theme.textFont})` }}
            >
              <span>Starting Total:</span>
              <span
                className="text-lg"
                style={{ color: theme.primaryColor }}
              >
                ${totalPrice}/
                {strategy.billingPeriod === "monthly" ? "mo" : "yr"}
              </span>
            </div>
            <div
              className="text-xs text-right"
              style={{
                fontFamily: `var(--font-text, ${theme.textFont})`,
                color: 'hsl(var(--muted-foreground))'
              }}
            >
              + selected optional features
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
