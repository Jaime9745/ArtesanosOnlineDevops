import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import { reactRefresh } from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite(),
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    // Versión explícita, no 'detect': la autodetección de
    // eslint-plugin-react 7.37 llama a context.getFilename(), que ESLint 10
    // eliminó, y revienta la ejecución entera.
    settings: { react: { version: '19.2' } },

    rules: {
      // React 19 ya no valida propTypes en tiempo de ejecución (los ignora en
      // silencio), así que exigirlos sólo añadiría código muerto.
      'react/prop-types': 'off',
      // Regla nueva de react-hooks 7. Marca el clásico "cargar datos al
      // montar", que aquí es intencionado; degradada a aviso en vez de
      // reescribir toda la obtención de datos dentro de esta migración.
      'react-hooks/set-state-in-effect': 'warn',
      // StoreContext exporta el contexto y el proveedor juntos: sólo afecta al
      // fast refresh en desarrollo, no a la build.
      'react-refresh/only-export-components': 'warn',
    },
  },
])
