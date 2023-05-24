import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  entry: ["src/**/*.(tsx|ts)"],
  format: ["esm"],
  dts: true,
  minify: true,
  clean: true,
  exclude: ["**/*.test.ts", "tsup.config.ts", "dist"],
  external: ["react"],
  ...options,
}));
