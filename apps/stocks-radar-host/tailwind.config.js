const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        flashGreen: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: colors.green[500] },
        },
        flashBlue: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: colors.blue[500] },
        },
        flashRed: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: colors.red[500] },
        },
      },
      animation: {
        'flash-green': 'flashGreen 0.5s ease-in-out',
        'flash-blue': 'flashBlue 0.5s ease-in-out',
        'flash-red': 'flashRed 0.5s ease-in-out',
      },
    },
  },
  plugins: [require('tailwindcss-animated')],
};
