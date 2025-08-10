import { ReactNode } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface ThemedPricingPageProps {
  children: ReactNode;
  className?: string;
}

export function ThemedPricingPage({
  children,
  className = "",
}: ThemedPricingPageProps) {
  const { theme } = useTheme();

  return (
    <div
      className={`${className} transition-all duration-300`}
      style={{
        background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
        fontFamily: `var(--font-text, ${theme.textFont})`,
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          .themed-pricing-page h1,
          .themed-pricing-page h2,
          .themed-pricing-page h3,
          .themed-pricing-page h4,
          .themed-pricing-page h5,
          .themed-pricing-page h6 {
            font-family: var(--font-header, ${theme.headerFont}) !important;
          }

          .themed-pricing-page button {
            font-family: var(--font-button, ${theme.buttonFont}) !important;
          }

          .themed-pricing-page .pricing-card {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .themed-pricing-page .glass-effect {
            backdrop-filter: blur(20px);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
        `
      }} />

      <div
        className={`themed-pricing-page min-h-full bg-gradient-to-br ${theme.backgroundColor}`}
      >
        {children}
      </div>
    </div>
  );
}
