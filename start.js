const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.js');

const HOST = '0.0.0.0';
const PORT = 8080;

const server = new WebpackDevServer(
    webpack(webpackConfig),
    {
        contentBase: webpackConfig.output.path,
        public: webpackConfig.output.publicPath,
        filename: webpackConfig.output.filename,
        hot: true,
        historyApiFallback: true,
        quiet: false,
        noInfo: false,
        inline: true,
        lazy: false,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        }
    }
);

server.listen(PORT, HOST, () => console.log(`Frontend server running at http://localhost:${PORT}...`));
