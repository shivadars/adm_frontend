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
          light:     '#e0f4ee',   // Base background (mint green)
          muted:     '#ccebe1',   // Soft Section bg (muted green)
          dark:      '#073b3a',   // Deep text/headings (dark green)
          blue:      '#073b3a',   // Primary accents/buttons (dark green)
          pink:      '#ff6b81',   // Boutique accent (vibrant coral pink)
          sky:       '#38bdf8',   // Hovers/Highlights
          border:    '#b8e3d6',   // Lines/Borders (soft green border)
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
