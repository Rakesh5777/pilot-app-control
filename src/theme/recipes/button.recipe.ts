import { defineRecipe } from "@chakra-ui/react";

export const buttonRecipe = defineRecipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "md",
    fontWeight: "medium",
    transition: "all 0.2s",
    cursor: "pointer",
    border: "none",
    outline: "none",
    textDecoration: "none",
    userSelect: "none",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    lineHeight: "1.2",
    _focus: {
      boxShadow: "0 0 0 2px {colors.primary.500}40",
    },
    _disabled: {
      opacity: 0.6,
      cursor: "not-allowed",
      pointerEvents: "none",
    },
  },
  variants: {
    variant: {
      solid: {
        bg: "primary.bg",
        color: "primary.fg",
        _hover: { bg: "primary.hover" },
        _active: { bg: "primary.700" },
      },
      outline: {
        borderWidth: "1px",
        borderColor: "primary.bg",
        color: "primary.bg",
        bg: "transparent",
        _hover: {
          bg: "primary.hover",
          color: "primary.fg",
          borderColor: "primary.hover",
        },
        _active: {
          bg: "primary.700",
          borderColor: "primary.700",
        },
      },
      ghost: {
        bg: "transparent",
        color: "primary.bg",
        _hover: {
          bg: "primary.50",
        },
        _active: {
          bg: "primary.100",
        },
      },
      secondary: {
        bg: "secondary.bg",
        color: "secondary.fg",
        _hover: { bg: "secondary.hover" },
        _active: { bg: "secondary.700" },
      },
      accent: {
        bg: "accent.bg",
        color: "accent.fg",
        _hover: { bg: "accent.hover" },
        _active: { bg: "accent.700" },
      },
      destructive: {
        bg: "status.error.500",
        color: "white",
        _hover: { bg: "status.error.600" },
        _active: { bg: "status.error.700" },
      },
      plain: {
        bg: "transparent",
        color: "primary.bg",
      },
    },
    size: {
      xs: {
        px: "2",
        py: "1",
        fontSize: "2xs",
        minH: "6",
        gap: "1",
      },
      sm: {
        px: "3",
        py: "1.5",
        fontSize: "sm",
        minH: "8",
        gap: "1.5",
      },
      md: {
        px: "4",
        py: "2",
        fontSize: "md",
        minH: "10",
        gap: "2",
      },
      lg: {
        px: "6",
        py: "3",
        fontSize: "lg",
        minH: "12",
        gap: "2",
      },
      xl: {
        px: "8",
        py: "4",
        fontSize: "xl",
        minH: "14",
        gap: "3",
      },
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});
