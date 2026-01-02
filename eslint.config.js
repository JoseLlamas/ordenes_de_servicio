import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

/** @type {import('eslint').Linter.Config[]} */
export default [
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...svelte.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    }
  },
  {
    rules: {
      indent: ['error', 2], // Usa 2 espacios para la indentación
      quotes: ['error', 'single'], // Usa comillas simples
      semi: ['error', 'always'], // Requiere punto y coma
      'no-trailing-spaces': 'error', // Prohíbe espacios en blanco al final de las líneas
      'eol-last': ['error', 'always'], // Requiere una línea vacía al final del archivo
      'max-len': ['warn', { // Longitud máxima de línea
        code: 200, // Límite de 80 caracteres por línea
        ignoreUrls: true, // Ignorar URLs
        ignoreStrings: true // Ignorar cadenas largas
      }],
      'object-curly-spacing': ['error', 'always'], // Espacios dentro de llaves
      'array-bracket-spacing': ['error', 'never'], // Sin espacios dentro de corchetes
      'comma-dangle': ['error', 'never'], // No permitir comas finales en objetos y arrays
      // Mejoras de calidad
      'no-unused-vars': ['warn'], // Advertir sobre variables no utilizadas
      'no-console': ['warn'], // Advertir sobre console.log (útil en producción)
      'no-debugger': 'error', // Prohíbe el uso de debugger
      'prefer-const': 'off', // Prefiere const sobre let si la variable no se reasigna
      eqeqeq: ['error', 'always', { null: 'ignore' }], // Requiere el uso de === y !== en lugar de == y !=
      curly: ['error', 'all'], // Requiere llaves para todas las estructuras de control
      'no-multi-spaces': 'error', // Prohíbe múltiples espacios excepto para la alineación
      'arrow-spacing': ['error', { // Espaciado alrededor de flechas en funciones
        before: true,
        after: true
      }],
      // Opcionales (basado en preferencias)
      'function-paren-newline': ['error', 'consistent'], // Consistencia en las funciones multilínea
      'linebreak-style': ['error', 'unix'], // Estilo de saltos de línea (LF)
      'space-before-function-paren': ['error', 'always'], // Espacio antes del paréntesis de funciones
      'key-spacing': ['error', { // Alineación en objetos
        beforeColon: false,
        afterColon: true
      }],
      'svelte/no-navigation-without-resolve': [
        'error',
        {
          ignoreGoto: true,
          ignoreLinks: true,
          ignorePushState: false,
          ignoreReplaceState: false
        }
      ]
    }
  },
  {
    files: ['**/*.svelte', '**/*.svelte.js'],
    languageOptions: { parserOptions: { svelteConfig } }
  }
];
