import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import url from "rollup-plugin-url";
import pkg from "./package.json";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: pkg.main,
      format: "cjs",
    },
    {
      file: "dist/bundle.min.js",
      format: "cjs",
      plugins: [
        terser({
          output: {
            comments: false,
          },
        }),
      ],
    },
    {
      file: pkg.module,
      format: "es",
    },
  ],
  external: ["crypto"],
  plugins: [
    external(),
    postcss({
      modules: true,
    }),
    url(),
    resolve(),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
    }),
    commonjs(),
  ],
};
