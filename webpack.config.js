var ExtractTextPlugin = require("extract-text-webpack-plugin");

var extractLess = new ExtractTextPlugin('[name].css');
var cssLoader = extractLess.extract(['css-loader']);

module.exports = {
    plugins: [extractLess],
    entry: './src/index.js',
    output: {
        path: __dirname + '/public',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: [/node_modules/]
            },
            {
                test: /\.json$/,
                use: 'json-loader'
            },
            {
                test: /\.css$/i,
                use: cssLoader
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
                use: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
            }
        ]
    }
};
