import { defineRecipe } from "@chakra-ui/react";

export const cardRecipe = defineRecipe({
  base: {
    bg: "bg.muted",
    borderRadius: "lg",
    overflow: "hidden",
    position: "relative",
  },
  variants: {
    variant: {
      elevated: {
        boxShadow: "md",
        border: "1px solid",
        borderColor: "border.muted",
      },
      outline: {
        border: "1px solid",
        borderColor: "border.default",
      },
      filled: {
        bg: "bg.subtle",
      },
      ghost: {
        bg: "transparent",
      },
    },
    size: {
      sm: {
        p: "3",
      },
      md: {
        p: "4",
      },
      lg: {
        p: "6",
      },
      xl: {
        p: "8",
      },
    },
  },
  defaultVariants: {
    variant: "elevated",
    size: "md",
  },
});
