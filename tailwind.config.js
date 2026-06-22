import { colors as hudColors } from './src/styles/colors.ts'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        hud: {
          bg: hudColors.bg,
          card: hudColors.card,
          list: hudColors.list,
          text: hudColors.text,
          highlight: hudColors.highlight,
          accent: hudColors.accent,
          alert: hudColors.alert,
          muted: hudColors.muted,
          active: hudColors.active,
          secondary: hudColors.secondary,
          tag: hudColors.tag,
          'tag-alert': hudColors.tagAlert,
          border: hudColors.border,
          progress: hudColors.progress,
          'progress-track': hudColors.progressTrack,
          viewport: hudColors.viewport,
          'grid-major': hudColors.gridMajor,
          'grid-minor': hudColors.gridMinor,
          'grid-cross': hudColors.gridCross,
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'system-ui', 'sans-serif'],
        mono: ['Consolas', '"Courier New"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
    },
  },
  plugins: [],
}
