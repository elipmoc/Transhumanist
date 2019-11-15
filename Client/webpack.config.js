
console.log("すごーい！君はwebpackできるフレンズなんだね！");
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
module.exports = {

    mode: 'development',

    entry: {
        "Client/board": "./Client/board.ts",
        "Client/login": "./Client/login.ts",
    },
    output: {
        filename: './dist/[name].js'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, use: 'ts-loader' }
        ]
    },
    plugins: [
        new HardSourceWebpackPlugin()
    ]
}