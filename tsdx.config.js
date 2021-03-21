const postcss = require("rollup-plugin-postcss");
const analyze = require("rollup-plugin-analyzer");

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        modules: true,
      }),
      analyze({
        summaryOnly: true,
      })
    );

    return config;
  },
};
