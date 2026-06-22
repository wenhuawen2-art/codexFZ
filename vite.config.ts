import path from 'node:path'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** file:// 协议：经典 script 需 defer，等 DOM 就绪后再执行（避免 React #299） */
function fileProtocolHtml(): Plugin {
  return {
    name: 'file-protocol-html',
    enforce: 'post',
    transformIndexHtml(html) {
      const withoutModule = html
        .replace(/\s*type="module"\s*/g, ' ')
        .replace(/\s*crossorigin\s*/g, ' ')

      const scripts =
        withoutModule.match(/<script[^>]*src="[^"]+"[^>]*><\/script>/g) ?? []

      let result = withoutModule
      for (const script of scripts) {
        result = result.replace(script, '')
      }

      const bodyScripts = scripts
        .map((script) =>
          script.includes('defer') ? script : script.replace('<script', '<script defer'),
        )
        .join('\n    ')

      return result.replace('</body>', `    ${bodyScripts}\n  </body>`)
    },
  }
}

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [react(), fileProtocolHtml()],
  build: {
    target: 'chrome90',
    minify: 'terser',
    cssTarget: 'chrome90',
    modulePreload: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        name: 'LaserRadarApp',
        entryFileNames: 'assets/app.js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: { target: 'chrome90' },
  },
})
