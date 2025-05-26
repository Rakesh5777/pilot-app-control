import { defineRecipe } from "@chakra-ui/react";

export const tableRecipe = defineRecipe({
  base: {
    width: "100%",
    borderCollapse: "collapse",
    borderSpacing: "0",
  },
  variants: {
    variant: {
      simple: {
        "& thead th": {
          borderBottom: "1px solid",
          borderColor: "border.default",
          bg: "bg.muted",
          color: "fg.default",
          fontWeight: "semibold",
          textAlign: "left",
        },
        "& tbody td": {
          borderBottom: "1px solid",
          borderColor: "border.muted",
        },
        "& tbody tr:last-child td": {
          borderBottom: "none",
        },
      },
      striped: {
        "& thead th": {
          bg: "bg.muted",
          color: "fg.default",
          fontWeight: "semibold",
          textAlign: "left",
          borderBottom: "1px solid",
          borderColor: "border.default",
        },
        "& tbody tr:nth-of-type(odd)": {
          bg: "bg.subtle",
        },
        "& tbody tr:hover": {
          bg: "primary.50",
        },
      },
      outline: {
        border: "1px solid",
        borderColor: "border.default",
        "& thead th": {
          bg: "bg.muted",
          color: "fg.default",
          fontWeight: "semibold",
          textAlign: "left",
          borderBottom: "1px solid",
          borderColor: "border.default",
        },
        "& tbody td": {
          borderBottom: "1px solid",
          borderColor: "border.muted",
        },
        "& tbody tr:last-child td": {
          borderBottom: "none",
        },
      },
    },
    size: {
      sm: {
        "& th, & td": {
          px: "2",
          py: "1",
          fontSize: "sm",
        },
      },
      md: {
        "& th, & td": {
          px: "4",
          py: "3",
          fontSize: "md",
        },
      },
      lg: {
        "& th, & td": {
          px: "6",
          py: "4",
          fontSize: "lg",
        },
      },
    },
  },
  defaultVariants: {
    variant: "simple",
    size: "md",
  },
});
