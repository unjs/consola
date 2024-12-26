import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  rollup: {
    inlineDependencies: true,
  },
  hooks: {
    "rollup:options"(_, options) {
      for (const output of options.output as any[]) {
        // @ts-ignore
        output.exports = "named";
      }

      // Node.js 14 support
      // https://github.com/unjs/consola/issues/204
      options.plugins.push({
        name: "icu-compat",
        transform(code, id) {
          if (id.endsWith("string-width/index.js")) {
            return code.replace(
              "const segmenter = new Intl.Segmenter();",
              "const segmenter = globalThis.Intl?.Segmenter ? new Intl.Segmenter() : { segment: (str) => str.split('') };",
            );
          }
        },
      });
    },
  },
});
