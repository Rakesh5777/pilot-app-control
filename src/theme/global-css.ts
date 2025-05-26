export const globalCss = {
  "html, body": {
    margin: 0,
    padding: 0,
    fontFamily: "body",
    lineHeight: "base",
    color: "fg.default",
    bg: "bg.default",
  },
  "*": {
    boxSizing: "border-box",
  },
  "*, *::before, *::after": {
    borderColor: "border.default",
  },
  // Custom scrollbar
  "::-webkit-scrollbar": {
    width: "8px",
  },
  "::-webkit-scrollbar-track": {
    bg: "bg.subtle",
  },
  "::-webkit-scrollbar-thumb": {
    bg: "gray.400",
    borderRadius: "full",
  },
  "::-webkit-scrollbar-thumb:hover": {
    bg: "gray.500",
  },
};
