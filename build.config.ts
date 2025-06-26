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

      // Prompts theme
      // https://github.com/bombshell-dev/clack/issues/36
      options.plugins.push({
        name: "@clack/prompts",
        transform(code, id) {
          if (id.endsWith("@clack/prompts/dist/index.mjs")) {
            const replaces = [
              ["}  $", "} $"],
              [String.raw`"\u25C6","*"`, '"❯", ">"'],
              [String.raw`"\u25A0","x"`, '"■", "x"'],
              [String.raw`"\u25B2","x"`, '"▲", "x"'],
              [String.raw`"\u25C7","o"`, '"✔", "√"'],
              [String.raw`"\u250C","T"`, '""'],
              [String.raw`"\u2502","|"`, '""'],
              [String.raw`"\u2514","\u2014"`, '""'],
            ] as const;
            for (const [from, to] of replaces) {
              code = code.replaceAll(from, to);
            }
            return code;
          }
        },
      }, {
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
