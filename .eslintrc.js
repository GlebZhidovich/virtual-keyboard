module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:sonarjs/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module",
        "project": "tsconfig.json",
        "tsconfigRootDir": ".",
    },
    "plugins": [
        "@typescript-eslint",
        "sonarjs"
    ],
    "rules": {
      "semi": ["error", "always"],
      "quotes": ["error", "single"],
      "sonarjs/cognitive-complexity": "error",
      "sonarjs/no-identical-expressions": "error"
    }
};
