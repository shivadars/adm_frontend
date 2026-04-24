/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // A'DOREMOM Pure Blue Palette
        brand: {
          light:     '#e8f0fe',   // Base background (ice blue)
          muted:     '#d2e3fc',   // Soft Section bg (muted blue)
          dark:      '#0a2540',   // Deep text/headings (navy blue)
          blue:      '#2563eb',   // Primary accents/buttons (royal blue)
          pink:      '#ff6b81',   // Boutique accent (vibrant coral pink)
          sky:       '#38bdf8',   // Hovers/Highlights (bright sky blue)
          border:    '#bfdbfe',   // Lines/Borders (soft border blue)
        },
      },
      fontFamily: {
        serif: ['"Lora"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'boutique': '0 4px 24px 0 rgba(10,37,64,0.08), 0 1px 4px 0 rgba(0,0,0,0.04)',
        'boutique-hover': '0 12px 40px 0 rgba(10,37,64,0.14), 0 2px 8px 0 rgba(0,0,0,0.06)',
        'soft': '0 2px 12px 0 rgba(10,37,64,0.05)',
      },
      borderRadius: {
        'boutique': '1.25rem',
      },
    },
  },
  plugins: [],
}
