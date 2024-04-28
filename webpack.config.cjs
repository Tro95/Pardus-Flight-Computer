const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'pardus-flight-computer.js',
        library: {
            name: 'PardusFlightComputer',
            type: 'umd',
            export: 'default',
        },
    },
    optimization: {
        minimize: false,
    },
    resolve: {
        fullySpecified: false,
    },
};
