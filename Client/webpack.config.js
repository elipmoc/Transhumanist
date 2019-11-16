
console.log("すごーい！君はwebpackできるフレンズなんだね！");
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
module.exports = {

    mode: 'development',

    entry: {
        "board": "./src/board.ts",
        "login": "./src/login.ts",
    },
    output: {
        filename: './public/dist/[name].js'
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