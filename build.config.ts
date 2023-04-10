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
    },
  },
});
