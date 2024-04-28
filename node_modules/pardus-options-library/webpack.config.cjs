const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'pardus-options-library.js',
        library: {
            type: 'umd',
        },
    },
    optimization: {
        minimize: true,
    },
};
