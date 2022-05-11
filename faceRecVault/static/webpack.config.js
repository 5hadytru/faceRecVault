const path = require('path') // path module from node

module.exports = {
    entry: {
        index: './src/index.js',
        vault: './src/vault.js',
        vaultEntry: './src/vaultEntry.js'
    },
    watch: true,
    devtool: 'source-map', // for debugging
    output: {
        path: path.resolve(__dirname, 'dist'), // where to place compiled js bundle
        filename: '[name]-bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/, // when this rule is satisfied, the operation runs
                exclude: /node_modules/, // dont look at these
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    resolve: {          // use webpack on the following extensions
        extensions: [
            '.js'
        ]
    }
    /*
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        publicPath: '',
        writeToDisk: true
    }
    */
}