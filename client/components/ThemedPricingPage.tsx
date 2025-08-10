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
      }}
    >
      <style>{`
        .themed-pricing-page {
          --tw-gradient-from: ${theme.backgroundColor.includes("from-")
            ? `var(--${theme.backgroundColor.split("from-")[1].split(" ")[0]})`
            : "rgb(248 250 252)"};
          --tw-gradient-to: ${theme.backgroundColor.includes("to-")
            ? `var(--${theme.backgroundColor.split("to-")[1]})`
            : "rgb(241 245 249)"};
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
        }

        .themed-pricing-page {
          font-family: var(--font-text, ${theme.textFont});
        }

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
      `}</style>

      <div
        className={`themed-pricing-page min-h-full bg-gradient-to-br ${theme.backgroundColor}`}
      >
        {children}
      </div>
    </div>
  );
}
