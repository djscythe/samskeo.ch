export default {
  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-recess-order",
    "stylelint-plugin-logical-css/configs/recommended",
  ],
  plugins: ["stylelint-gamut", "stylelint-plugin-logical-css"],
  rules: {
    "color-function-notation": "modern",
    "color-no-hex": true,
    "function-disallowed-list": ["rgba", "hsla", "rgb", "hsl"],
    "gamut/color-no-out-gamut-range": true,
    "scss/double-slash-comment-empty-line-before": [
      "always",
      {
        ignore: ["between-comments", "stylelint-commands", "inside-block"],
      },
    ],
  },
};
