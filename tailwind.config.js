/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{js,jsx,ts,tsx}', './src/components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary:            '#B872FF',
        'primary-muted':    '#B872FF60',
        background:         '#021123',
        navy:               '#144480',
        muted:              '#98A0A8',
        danger:             '#ef4444',
        'danger-light':     '#f87171',
        success:            '#22c55e',
        'success-light':    '#4ade80',
        warning:            '#facc15',
        info:               '#60a5fa',
        'info-light':       '#a78bfa',
        'order-processing': '#fb923c',
      },
    },
  },
  plugins: [],
}
