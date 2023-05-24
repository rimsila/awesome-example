import { defineConfig } from "umi";

export default defineConfig({
  npmClient: "pnpm",
  mfsu: { exclude: ["ui"] },
  tailwindcss: {},
  plugins: ["@umijs/plugins/dist/tailwindcss"],
});
