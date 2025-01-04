module.exports = {
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"project": "tsconfig.json",
		"sourceType": "module"
	},
	"plugins": [
		"@typescript-eslint/eslint-plugin",
		"import",
		"unused-imports"
	],
	"extends": [
		"plugin:@typescript-eslint/recommended"
	],
	"root": true,
	"env": {
		"node": true,
		"jest": true
	},
	"rules": {
    "indent": [
      "error", 2, {
        ignoredNodes: ["PropertyDefinition"],
        SwitchCase: 1
      }
    ],
		"max-len": ["error", { "code": 100 }],
		"quotes": ["error", "single", { "avoidEscape": true }],
		"semi": ["error", "always"],
		"comma-dangle": ["error", "always-multiline"],
		"eol-last": ["error", "always"],
		"no-trailing-spaces": "error",
		"no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
		"object-curly-spacing": ["error", "always"],
		"array-bracket-spacing": ["error", "never"],
		"comma-spacing": ["error", { "before": false, "after": true }],
		"keyword-spacing": ["error", { "before": true, "after": true }],
		"import/order": [
			"error",
			{
				"groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
				"newlines-between": "always",
				"alphabetize": {
					"order": "asc",
					"caseInsensitive": true
				}
			}
		],
		"import/no-duplicates": "error",
		"unused-imports/no-unused-imports": "error",
		"no-console": "warn",
		"no-debugger": "error",
		"brace-style": ["error", "1tbs"],
		"space-before-blocks": "error",
		"space-before-function-paren": ["error", {
			"anonymous": "always",
			"named": "never",
			"asyncArrow": "always"
		}],
		"space-in-parens": ["error", "never"],
		"space-infix-ops": "error",
		"@typescript-eslint/no-unused-vars": ["error", {
			"argsIgnorePattern": "^_",
			"varsIgnorePattern": "^_"
		}],
		"@typescript-eslint/no-empty-interface": "error",
		"@typescript-eslint/no-empty-function": "error",
		"@typescript-eslint/naming-convention": [
			"error",
			{
				"selector": "interface",
				"format": ["PascalCase"],
				"prefix": ["I"]
			},
			{
				"selector": "typeAlias",
				"format": ["PascalCase"]
			},
			{
				"selector": "enum",
				"format": ["PascalCase"]
			}
		],
		"curly": "error",
		"eqeqeq": ["error", "always"],
		"no-var": "error",
		"prefer-const": "error",
		"radix": "error",
		"yoda": "error",
		"no-shadow": "off",
		"@typescript-eslint/no-shadow": ["error"],
		"no-return-await": "error",
	},
	"ignorePatterns": [
		"dist",
		"node_modules",
		"*.js"
	]
};