import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/config/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f9f5",
          100: "#d6f3e2",
          200: "#a9e5c1",
          300: "#74ce97",
          400: "#46b271",
          500: "#2E9B5B", // Hijau cincin logo: tombol aksi utama, link, focus
          600: "#257849",
          700: "#20533a",
          800: "#1b3d2c",
          850: "#1a382a",
          900: "#224836", // Hijau tua logo: panel sidebar, header, hero
          950: "#12251c",
        },
        gold: {
          50: "#fdf8ee",
          100: "#faebd0",
          200: "#f2d8a5",
          300: "#e8c072",
          400: "#d8a543",
          500: "#C9922B", // Emas logo: aksen kecil, badge, indikator aktif
          600: "#a6751c",
          700: "#7e5714",
        },
      },
    },
  },
  plugins: [],
};

export default config;
