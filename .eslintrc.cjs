module.exports = {
  root: true,
  extends: ["@nuxtjs/eslint-config-typescript", "@vue/eslint-config-prettier"],
  rules: {
    semi: ["error", "always"], // Require semicolons
    quotes: ["error", "double"], // Require double quotes

    "import/order": [
      "error",
      {
        groups: [["builtin", "external"], ["internal"], ["sibling", "parent"], "index", "object", "type"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],

    "vue/multi-word-component-names": "off", // Allow multi-word component names
    "vue/require-default-prop": "off", // Allow props without default values
    "vue/no-multiple-template-root": "off", // Allow multiple root elements in templates
  },
};
