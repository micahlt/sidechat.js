import copy from "rollup-plugin-copy";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.cjs",
      format: "cjs",
    },
    {
      file: "dist/index.mjs",
      format: "es",
    },
  ],
  plugins: [
    // ...
    copy({
      targets: [
        { src: "dist/index.d.ts", dest: "dist", rename: "index.d.mts" },
      ],
    }),
  ],
};
