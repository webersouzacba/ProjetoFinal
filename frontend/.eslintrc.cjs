module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-essential"
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  rules: {
    // Vue 3 permite múltiplos roots (fragments)
    "vue/no-multiple-template-root": "off",

    // Desliga regras de formatação que estão poluindo o VS Code
    "vue/max-attributes-per-line": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/multiline-html-element-content-newline": "off",
    "vue/html-indent": "off",
    "vue/html-self-closing": "off",
    "vue/attributes-order": "off",
    "vue/valid-template-root": "off"
  }

};
