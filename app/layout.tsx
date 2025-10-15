import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "PricingCraft | SaaS Pricing Model Builder",
  description:
    "Build, preview, and compare SaaS pricing plans with real-time visualizations and configurable themes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
