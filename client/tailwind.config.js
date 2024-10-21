/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "sfpro": ["sfpro"]
      },
      backgroundImage: {
        "vote": "url('https://images.pexels.com/photos/8850709/pexels-photo-8850709.jpeg')"
      }
    },
  },
  plugins: [],
}