import { defineConfig, createSystem, defaultConfig } from "@chakra-ui/react";
import { recipes } from "./recipes";
import { 
  colors, 
  spacing, 
  fonts, 
  fontSizes, 
  fontWeights, 
  lineHeights, 
  radii, 
  shadows 
} from "./tokens";
import { semanticTokens } from "./semantic-tokens";
import { globalCss } from "./global-css";

const config = defineConfig({
  preflight: false,
  cssVarsPrefix: "chakra",
  cssVarsRoot: ":where(:root, :host)",
  globalCss,
  theme: {
    tokens: {
      colors,
      spacing,
      fonts,
      fontSizes,
      fontWeights,
      lineHeights,
      radii,
      shadows,
      sizes: spacing, // Reuse spacing for sizes
      borderWidths: {
        "1px": { value: "1px" },
        "2px": { value: "2px" },
        "4px": { value: "4px" },
        "8px": { value: "8px" },
      },
      durations: {
        "ultra-fast": { value: "50ms" },
        "faster": { value: "100ms" },
        "fast": { value: "150ms" },
        "normal": { value: "200ms" },
        "slow": { value: "300ms" },
        "slower": { value: "400ms" },
        "ultra-slow": { value: "500ms" },
      },
      easings: {
        "ease-in": { value: "cubic-bezier(0.4, 0, 1, 1)" },
        "ease-out": { value: "cubic-bezier(0, 0, 0.2, 1)" },
        "ease-in-out": { value: "cubic-bezier(0.4, 0, 0.2, 1)" },
      },
    },
    semanticTokens,
    recipes,
    keyframes: {
      spin: {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
      pulse: {
        "0%, 100%": { opacity: "1" },
        "50%": { opacity: "0.5" },
      },
      bounce: {
        "0%, 100%": {
          transform: "translateY(-25%)",
          animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
        },
        "50%": {
          transform: "translateY(0)",
          animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
export default system;
