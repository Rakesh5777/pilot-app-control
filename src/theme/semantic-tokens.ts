export const semanticTokens = {
  colors: {
    // Semantic color mappings for better theming
    "button.primary": { value: "{colors.primary.bg}" },
    "button.secondary": { value: "{colors.secondary.bg}" },
    "text.primary": { value: "{colors.fg.default}" },
    "text.secondary": { value: "{colors.fg.muted}" },
    "text.muted": { value: "{colors.fg.subtle}" },
    "bg.surface": { value: "{colors.bg.muted}" },
    "bg.canvas": { value: "{colors.bg.default}" },
    "bg.subtle": { value: "{colors.bg.subtle}" },
    "border.primary": { value: "{colors.border.default}" },
    "border.secondary": { value: "{colors.border.muted}" },
    
    // Status semantic tokens
    "status.success": { value: "{colors.status.success.500}" },
    "status.error": { value: "{colors.status.error.500}" },
    "status.warning": { value: "{colors.status.warning.500}" },
    "status.info": { value: "{colors.status.info.500}" },
  },
};
