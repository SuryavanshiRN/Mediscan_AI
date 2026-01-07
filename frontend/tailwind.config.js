/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Dynamic background colors using CSS variables
        background: {
          DEFAULT: "rgb(var(--bg-primary) / <alpha-value>)",
          light: "rgb(var(--surface-primary) / <alpha-value>)",
          secondary: "rgb(var(--bg-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--bg-tertiary) / <alpha-value>)",
        },
        // Card and surface colors
        surface: {
          DEFAULT: "rgb(var(--surface-primary) / <alpha-value>)",
          hover: "rgb(var(--surface-hover) / <alpha-value>)",
        },
        // Primary blue palette - Modern and professional
        primary: {
          DEFAULT: "rgb(var(--primary-color) / <alpha-value>)",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#172554",
        },
        // Accent indigo for secondary actions
        accent: {
          DEFAULT: "rgb(var(--accent-color) / <alpha-value>)",
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        // Medical colors with blue tones
        medical: {
          primary: "rgb(var(--primary-color) / <alpha-value>)",
          "primary-hover": "rgb(var(--primary-hover) / <alpha-value>)",
          secondary: "#0EA5E9", // Sky blue
          accent: "#6366F1", // Indigo
          success: "#10B981", // Emerald
          warning: "#F59E0B", // Amber
          error: "#EF4444", // Red
          info: "#3B82F6", // Blue
        },
        // Border colors - subtle blue tints
        border: {
          DEFAULT: "rgb(var(--border-color) / <alpha-value>)",
          light: "rgb(var(--border-light) / <alpha-value>)",
          medium: "#94A3B8",
          dark: "#64748B",
        },
        // Text hierarchy using CSS variables
        text: {
          primary: "rgb(var(--text-primary) / <alpha-value>)",
          secondary: "rgb(var(--text-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--text-tertiary) / <alpha-value>)",
          muted: "rgb(var(--text-tertiary) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.025em" }],
        sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.01em" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem", fontWeight: "600" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", fontWeight: "600" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem", fontWeight: "700" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", fontWeight: "700" }],
      },
      borderRadius: {
        sm: "0.375rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        // Soft, professional shadows - blue tinted
        soft: "0 1px 3px rgba(59, 130, 246, 0.08)",
        medium:
          "0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)",
        large:
          "0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)",
        xl: "0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)",
        card: "0 2px 8px rgba(59, 130, 246, 0.06)",
        "card-hover": "0 4px 20px rgba(59, 130, 246, 0.12)",
        "inner-soft": "inset 0 2px 4px rgba(59, 130, 246, 0.06)",
        focus: "0 0 0 3px rgba(59, 130, 246, 0.2)",
        glow: "0 0 20px rgba(59, 130, 246, 0.4)",
        "glow-lg": "0 0 40px rgba(59, 130, 246, 0.3)",
        // Dark mode specific shadows
        "dark-soft": "0 1px 3px rgba(0, 0, 0, 0.3)",
        "dark-medium": "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
        "dark-large": "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
        "dark-glow": "0 0 20px rgba(96, 165, 250, 0.3)",
        "dark-glow-lg": "0 0 40px rgba(96, 165, 250, 0.2)",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)",
        "gradient-accent": "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
        "gradient-blue-purple":
          "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
        "gradient-ocean":
          "linear-gradient(135deg, #0EA5E9 0%, #3B82F6 50%, #6366F1 100%)",
        "gradient-teal": "linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)",
        "gradient-medical": "linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)",
        "gradient-subtle": "linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)",
        "gradient-dark":
          "linear-gradient(180deg, rgb(8, 12, 30) 0%, rgb(15, 23, 50) 100%)",
        "gradient-dark-card":
          "linear-gradient(180deg, rgba(30, 45, 85, 0.5) 0%, rgba(20, 30, 60, 0.7) 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "fade-in-up": "fadeInUp 0.4s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "scale-bounce": "scaleBounce 0.5s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "bounce-subtle": "bounceSubtle 1s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        wiggle: "wiggle 0.3s ease-in-out",
        shake: "shake 0.5s ease-in-out",
        ripple: "ripple 0.6s ease-out",
        glow: "glow 1.5s ease-in-out infinite",
        "rotate-y": "rotateY 0.6s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        scaleBounce: {
          "0%": { transform: "scale(0.8)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        glow: {
          "0%, 100%": {
            filter: "drop-shadow(0 0 5px rgba(59, 130, 246, 0.5))",
          },
          "50%": { filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.8))" },
        },
        rotateY: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
      },
      transitionDuration: {
        400: "400ms",
      },
    },
  },
  plugins: [],
};
