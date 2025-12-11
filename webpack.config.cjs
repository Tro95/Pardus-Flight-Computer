const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: 'production',
    entry: {
        'pardus-flight-computer': './src/index.js',
        'pardus-flight-computer.min': './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: {
            name: 'PardusFlightComputer',
            type: 'umd',
            export: 'default',
        },
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
          include: /\.min\.js$/
        })],
    },
    resolve: {
        fullySpecified: false,
    },
};
