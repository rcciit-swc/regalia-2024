import type { Config } from "tailwindcss";
import flowbite from "flowbite-react/tailwind";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],

  theme: {
    extend: {
      fontFamily: {
        annabel: ["Annabel", "sans-serif"],
        hollirood: ["Hollirood", "sans-serif"],
        retrolight: ["RetroLight", "sans-serif"],
      },
      colors: {
        regalia:
          "#c9a747",
      },
    },
  },
  plugins: [flowbite.plugin(),],
};
export default config;
