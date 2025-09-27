export default {
  extends: ["stylelint-config-standard-scss", "stylelint-config-recess-order"],
  plugins: ["stylelint-gamut", "stylelint-plugin-logical-css"],
  rules: {
    "color-function-notation": "modern",
    "color-no-hex": true,
    "function-disallowed-list": ["rgba", "hsla", "rgb", "hsl"],
    "gamut/color-no-out-gamut-range": true,
    "plugin/use-logical-properties-and-values": true,
    "plugin/use-logical-units": true,
  },
};
