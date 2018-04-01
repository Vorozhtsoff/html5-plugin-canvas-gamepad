const path = require('path');


const BUILD_PATH = './build';

module.exports = {
    entry: ['./src/index.js'],
    output: {
        path: path.resolve(__dirname, BUILD_PATH),
        publicPath: '/',
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },
    devtool: 'eval',
    devServer: {
        contentBase: path.join(__dirname, "build"),
        compress: false,
        port: 8080
    }
}