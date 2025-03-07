/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: ["class", "class"],
  theme: {
    extend: {
      animation: {
        loader: "loaderAnim 2s linear infinite",
      },
      keyframes: {
        loaderAnim: {
          "0%": { left: "0%", transform: "translateX(-100%)" },
          "100%": { left: "100%", transform: "translateX(0%)" },
        },
      },
      fontSize: {
        "32-34": ["32px", { lineHeight: "34px" }],
        "36-46": ["36px", { lineHeight: "46px" }],
        "32-42": ["32px", { lineHeight: "42px" }],
        "28-38": ["28px", { lineHeight: "38px" }],
        "40-48": ["40px", { lineHeight: "48px" }],
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        pacifico: ["Pacifico", "cursive"],
      },
      colors: {
        whiteshade: {
          primary: "#ffffff",
          secondary1: "",
          tertiary1: "#f2f2f2",
        },
        gray: {
          lighter: "#EDEDED",
          tertiary: "#F2F2F2",
          tertiary1: "#BDBDBD",
          secondary4: "#D9D9D9",
          secondary1: "#5F5F5F",
          secondary2: "#A6A6A6",
          secondary3: "#DDDDDD",
        },
        black: {
          primary: "#1e1e1e",
        },
        blue: {
          secondary1: "#0A3ADA",
          tertiary1: "#E7F1F6",
        },

        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
    fontFamily: {
      body: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      sans: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
    },
  },
  compilerOptions: {
    baseUrl: ".",
    paths: {
      "@/*": ["./src/*"],
    },
  },
  plugins: [require("tailwindcss-animate")],
};
