import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        "surface-canvas": "#FFFFFF",
        "surface-subtle": "#F0F0F0",
        "surface-dark": "#18181A",
        "surface-dark-elevated": "#242427",
        "border-light": "#EAEAEA",
        "border-dark": "#2E2E32",
        "status-success": "#82B440",
        "status-warning": "#F97316",
        "status-neutral": "#9CA3AF",
        "status-error": "#BA1A1A",
        "brand-lime": "#D2D88F",
        "lime-badge": "#E2E89D",
        "lime-text": "#454A10",
      },
    },
  },
  plugins: [],
} satisfies Config;
