module.exports = {
    "overrides": [
        {
            "files": ["**/*.ts", "**/*.tsx"],
            "plugins": ["@typescript-eslint/eslint-plugin"],
            "rules": {
                "no-use-before-define": "off",
                "@typescript-eslint/no-use-before-define": ["error"],
            },
            "parser": "@typescript-eslint/parser",
        }
    ],
    "plugins": [
        "react",
    ],
};
