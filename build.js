const webpack = require('webpack');

const webpackConfig = require('./webpack.config.js');

const compiler = webpack(webpackConfig);

const STATS_OPTIONS = {
    assets: false,
    colors: true,
    version: false,
    modules: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
    reasons: true,
    cached: true,
    chunkOrigins: true
};

compiler.hooks.beforeRun.tap('compile', () => console.log('Building frontend...'));

compiler.run((error, stats) => {
    if (error) {
        console.error(error.stack || error);

        if (error.details) {
            console.error(error.details);
        }

        process.exit(1);
    }

    process.stdout.write(`${stats.toString(STATS_OPTIONS)}\n`);
});
