/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FFFDF8',
          100: '#FAF6F0',
          200: '#F7F3EA',
          300: '#EBE5D8',
          400: '#D9D5CA',
        },
        forest: {
          50: '#F2F7F5',
          100: '#E2EEE9',
          500: '#3E8066',
          700: '#23594A',
          800: '#173F35',
          900: '#0F2C25',
          950: '#0A1E19',
        },
        sage: {
          100: '#E8EFEB',
          200: '#D3E0D8',
          500: '#6F8B7E',
          600: '#537063',
          700: '#3D5449',
        },
        terracotta: {
          100: '#F8ECE7',
          400: '#D9825E',
          500: '#C96F4A',
          600: '#B85B38',
          700: '#944426',
        },
        ink: {
          900: '#18211E',
          700: '#38433E',
          500: '#6B746F',
          300: '#9BA39E',
        },
        abacus: {
          frame: '#173F35',
          rod: '#A3B1A8',
          beadUpper: '#C96F4A',
          beadLower: '#537063',
          beadActive: '#23594A',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
