const webpack = require('webpack');
const path = require('path');
const HappyPack = require('happypack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const os = require('os');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'); // 更好在终端看到webapck运行的警告和错误
const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
});

const __SRC = path.resolve(__dirname, 'examples');
const port = 9999;

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        port,
        contentBase: path.join(__dirname, 'public'),
        publicPath: '/',
        historyApiFallback: true,
        hot: true,
        inline: true,
        quiet: true,
        open: true,
        overlay: {
            // 当出现编译器错误或警告时，就在网页上显示一层黑色的背景层和错误信息
            errors: true
        }
    },
    entry: {
        index: './examples/index'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@components': path.resolve(__dirname, 'components'),
            '@examples': path.resolve(__dirname, 'examples'),
        },
        modules: [__SRC, 'node_modules']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                use: 'happypack/loader?id=babel',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        // Makes some environment variables available to the JS code, for example:
        // if (process.env.NODE_ENV === 'development') { ... }.
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        }),
        // 以进度条的形式反馈打包进度
        new ProgressBarPlugin(),
        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'examples/index.html')
        }),
        new HappyPack({
            id: 'babel',
            threadPool: happyThreadPool,
            loaders: ['babel-loader'],
            verbose: true // 允许 HappyPack 输出日志
        }),
        // This is necessary to emit hot updates (currently CSS only):
        new webpack.HotModuleReplacementPlugin(),
        // Add module names to factory functions so they appear in browser profiler.
        new webpack.NamedModulesPlugin(),
        new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
                messages: [`You application is running here http://localhost:${port}`]
            }
        })
    ]
};
