const path = require('path');
const glob = require('glob');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: getEntryConfig(),
    output: {
        filename: "[name].js",
        path: __dirname + '/lib',
        libraryTarget: 'umd'
    },
    externals: [
        function (context, request, callback) {
            // 允许编译以下后缀文件
            if (/.jsx|.jpg|.png|.gif|.svg|.jpeg|.scss$/g.test(request)) {
                return callback();
            }
            callback(null, request);
        }
    ],
    resolve: {
        extensions: ['.js', '.css', '.json', '.jsx']
    },
    module: {
        rules: [
            {
                test: /.jsx|.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.(jpg|png|gif|svg|jpeg)$/,
                loader: 'url-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2 // 0 => 无 loader(默认); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ]
            },
        ]
    },
    plugins: [
        /*  new BundleAnalyzerPlugin({
             analyzerMode: 'static',
             openAnalyzer: true,
             logLevel: 'info'
         }), */
        new CleanWebpackPlugin('lib', {
            verbose: false,
            watch: true,
            exclude: ['.git', '.npmignore', 'package.json', 'README.md']
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        /*  new CopyPlugin([{
             from: './components/style',
             to: './style'
         }, {
             from: './components',
             to: '../es'
         }]) */
    ]
};

function getFileCollection() {
    const globPath = './components/**/*.*(jsx|js)';
    const files = glob.sync(globPath);
    return files;
}

function getEntryConfig() {
    let entryObj = {};
    getFileCollection().forEach(item => {
        const filePath = item.replace('./components', '');
        const key = filePath.substring(0, filePath.lastIndexOf('.'));
        entryObj[key] = path.resolve(__dirname, item);
    });
    console.log(entryObj, '========');
    return entryObj;
}
