/** @type {import('tailwindcss').Config} */
export default {
  content: ["../public/index.html", "./src/**/*.{js,ts,jsx,tsx}"], 
  // content: [], 
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        juniper: '#33cb9a',
        light_juniper: '#2EB78B',
        robin: '#4568dc',
        slate: '#52575c',
        cherry: '#df6145',
        honey: '#f6d87c',
        aqua: '#23c4f8',
        gitlab: '#6753B5',
        // english:#B7C4CF,
        sky: {
          400: '#38BDF8',
          200: '#BAE6FD',
        },


        vanilla: {
          100: '#ffffff',
          200: '#f5f5f5',
          300: '#eeeeee',
          400: '#c0c1c3'
        },
        ink: {
          100: '#373c49',
          200: '#2c303a',
          300: '#21242c',
          400: '#16181d'
        },
        honey_gold: {
          100: '#fdf3c1', // Light Honey
          200: '#fae27c', // Soft Honey
          300: '#f5d87c', // Honey (Existing)
          400: '#e6b400', // Deep Golden Honey
          500: '#c99800', // Dark Honey Amber
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"'
        ],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        mono: ['Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace']
      }
    }
  },
  plugins: []
}
