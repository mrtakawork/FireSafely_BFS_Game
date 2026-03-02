/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#667eea',
          dark: '#764ba2',
        },
      },
      boxShadow: {
        'card': '0 20px 60px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 10px 30px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
