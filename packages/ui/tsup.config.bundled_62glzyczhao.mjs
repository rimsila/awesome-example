var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {})
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// tsup.config.ts
import { defineConfig } from "tsup";
var tsup_config_default = defineConfig((options) => __spreadValues({
  treeshake: true,
  splitting: true,
  entry: ["src/**/*.(tsx|ts)"],
  format: ["esm"],
  dts: true,
  minify: true,
  clean: true,
  external: ["react"]
}, options));
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL1VzZXJzL3ppbGEvRG9jdW1lbnRzL3Byb2plY3QvbmV4dC1kZXYvYXdlc29tZS1leGFtcGxlL3BhY2thZ2VzL3VpL3RzdXAuY29uZmlnLnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIi9Vc2Vycy96aWxhL0RvY3VtZW50cy9wcm9qZWN0L25leHQtZGV2L2F3ZXNvbWUtZXhhbXBsZS9wYWNrYWdlcy91aVwiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vVXNlcnMvemlsYS9Eb2N1bWVudHMvcHJvamVjdC9uZXh0LWRldi9hd2Vzb21lLWV4YW1wbGUvcGFja2FnZXMvdWkvdHN1cC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIE9wdGlvbnMgfSBmcm9tIFwidHN1cFwiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKG9wdGlvbnM6IE9wdGlvbnMpID0+ICh7XG4gIHRyZWVzaGFrZTogdHJ1ZSxcbiAgc3BsaXR0aW5nOiB0cnVlLFxuICBlbnRyeTogW1wic3JjLyoqLyouKHRzeHx0cylcIl0sXG4gIGZvcm1hdDogW1wiZXNtXCJdLFxuICBkdHM6IHRydWUsXG4gIG1pbmlmeTogdHJ1ZSxcbiAgY2xlYW46IHRydWUsXG4gIGV4dGVybmFsOiBbXCJyZWFjdFwiXSxcbiAgLi4ub3B0aW9ucyxcbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFvVixTQUFTLG9CQUE2QjtBQUUxWCxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxZQUFzQjtBQUFBLEVBQ2pELFdBQVc7QUFBQSxFQUNYLFdBQVc7QUFBQSxFQUNYLE9BQU8sQ0FBQyxtQkFBbUI7QUFBQSxFQUMzQixRQUFRLENBQUMsS0FBSztBQUFBLEVBQ2QsS0FBSztBQUFBLEVBQ0wsUUFBUTtBQUFBLEVBQ1IsT0FBTztBQUFBLEVBQ1AsVUFBVSxDQUFDLE9BQU87QUFBQSxHQUNmLFFBQ0g7IiwKICAibmFtZXMiOiBbXQp9Cg==
