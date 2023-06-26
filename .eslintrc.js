module.exports = {
	'env': {
		'browser': true,
		'es2021': true,
		'node': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime'
	],
	'overrides': [
	],
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},
	'plugins': [
		'react'
	],
	'settings': {
		'react': {
			'version': 'detect'
		}
	},
	'rules': {
		'indent': [
			'warn',
			'tab',
			{ 'SwitchCase': 1 }
		],
		'linebreak-style': [
			'error',
			'windows'
		],
		'quotes': [
			'warn',
			'single'
		],
		'semi': [
			'error',
			'always'
		]
	}
};
