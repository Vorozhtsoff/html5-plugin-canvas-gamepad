const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BUILD_PATH = './build';
const getEnv = () => (process.env.NODE_ENV || 'development');

module.exports = {
    mode: getEnv(),
    entry: {
        gamepad: ['./src/index.js'],
        application: ['./src/application.js']
    },
    output: {
        path: path.resolve(__dirname, BUILD_PATH),
        publicPath: '/',
        filename: '[name].[hash].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/application/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: 'html-loader'
            }
        ]
    },
    devtool: 'eval',
    devServer: {
        contentBase: path.join(__dirname, 'build'),
        compress: false,
        port: 8080
    }
};
