/**
 * Created by zw9love on 2017/7/10.
 */

require('shelljs/global')
var webpack = require('webpack');
var autoprefixer = require('autoprefixer')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var extractCSS = new ExtractTextPlugin('stylesheets/[name]-one.css');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path')
var assetsSubDirectory = 'static'


module.exports = {
    // eval-source-map
    devtool: 'cheap-module-eval-source-map',//配置生成Source Maps，选择合适的选项
    entry: __dirname + '/src/main.js',//已多次提及的唯一入口文件
    /*
     output: {
     path: path.resolve(__dirname, './webapp/static'),//打包后的文件存放的地方
     // publicPath: './static',
     filename: "js/bundle.js"//打包后输出文件的文件名
     },
     */
    output: {
        path: path.resolve(__dirname, './public'),//打包后的文件存放的地方
        // publicPath: './static',
        filename: "bundle.js"//打包后输出文件的文件名
    },
    module: {//在配置文件里添加JSON loader
        rules: [
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',//在webpack的module部分的loaders里进行配置即可
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: path.posix.join(assetsSubDirectory, '/img/[name].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: path.posix.join(assetsSubDirectory, '/font/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin("Copyright Flying Unicorns inc."),//在这个数组中new一个就可以了
    ],
    devServer: {
        contentBase: "./public",//本地服务器所加载的页面所在的目录
        // colors: true,//终端中输出结果为彩色
        historyApiFallback: true,//不跳转
        inline: true,//实时刷新
        port: 9000,//实时刷新
        // 跨域联调配置
        proxy: {
            '/api/': {
                // target: 'http://192.168.0.115:9999/api/',
                target: 'http://192.168.0.234',
                changeOrigin: true,
                secure: false,
                pathRewrite: {'^/api': '/'}
            }
        }
    }
}

if (process.env.NODE_ENV === 'production') {

    /* 拼接编译输出文件路径 */
    var assetsPath = path.join(path.resolve(__dirname, './webapp/'), assetsSubDirectory)
    /* 删除这个文件夹 （递归删除） */
    rm('-rf', assetsPath)
    /* 创建此文件夹 */
    mkdir('-p', assetsPath)
    /* 复制 static 文件夹到我们的编译输出目录 */
    cp('-R', 'static/*', assetsPath)

    // '#source-map'
    module.exports.devtool = false
    module.exports.output = {
        path: path.resolve(__dirname, './webapp/'),//打包后的文件存放的地方
        publicPath: './',
        // filename: "/js/bundle.js"// 打包后输出文件的文件名
        filename: path.posix.join(assetsSubDirectory, 'js/bundle.[hash].js')
    }

    let css_json = {
        test: /\.css$/,
        use: // ExtractTextPlugin.extract 在dev模式下不好使 extractCSS
            ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            url: false
                        }
                    },
                    {
                        loader: "resolve-url-loader",
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [autoprefixer]
                            }
                        }
                    }]
            }),
    }
    module.exports.module.rules.push(css_json)
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new ExtractTextPlugin(path.posix.join(assetsSubDirectory, '/css/[name].[contenthash].css')),//  生成css文件夹
        new HtmlWebpackPlugin({
            filename: './index.html',
            inject: true,
            template: './template.html',
            //压缩HTML文件
            minify: {
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true, //删除空白符与换行符
                // 为了使GAEA能正确识别script, 保留引号
                // removeAttributeQuotes: true,
                minifyJS: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                warnings: false
            }
        }),
        // new webpack.LoaderOptionsPlugin({
        //     minimize: true
        // })
    ])
} else if (process.env.NODE_ENV === 'development') {
    // 1.0的 loader: 'style-loader!css-loader?modules'//添加对样式表的处理
    let css_json = {
        test: /\.css$/,
        use: [
            {
                loader: "style-loader"
            },
            {
                loader: "css-loader",
                options: {
                    modules: true
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    plugins: function () {
                        return [autoprefixer]
                    }
                }
            }
        ]
    }
    module.exports.module.rules.push(css_json)
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),
        // new ExtractTextPlugin(path.posix.join(assetsSubDirectory, '/css/[name].[contenthash].css')),//  生成css文件夹
        new webpack.HotModuleReplacementPlugin()

    ])
}
