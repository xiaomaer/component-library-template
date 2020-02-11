const path = require('path');
const glob = require('glob');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const createHappyPlugin = (id, loaders) => new HappyPack({
    id: id,
    loaders: loaders,
    threadPool: happyThreadPool,
    verbose: true
});

const _COM = path.resolve(__dirname, 'components');

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
            // 定义需要外部化的模块类型
            callback(null, request);
        }
    ],
    resolve: {
        extensions: ['.jsx', '.js', '.scss', '.css'],
        modules: [_COM, 'node_modules']
    },
    module: {
        rules: [
            {
                test: /.jsx|.js$/,
                include: _COM,
                exclude: /node_modules/,
                use: "happypack/loader?id=happy-babel"
            }, {
                test: /\.(jpg|png|gif|svg|jpeg)$/,
                loader: 'url-loader',
                include: _COM,
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                include: _COM,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ],
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
        createHappyPlugin('happy-babel', [{
            loader: 'babel-loader',
            options: {
                babelrc: true,
                cacheDirectory: true // 启用缓存
            }
        }]),
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
    // console.log(entryObj, '========');
    return entryObj;
}
