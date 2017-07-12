/**
 * Created by admin on 2017/7/10.
 */
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer')

module.exports = {
    devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项
    entry:  __dirname + '/app/main.js',//已多次提及的唯一入口文件
    output: {
        path: __dirname + "/public",//打包后的文件存放的地方
        filename: "bundle.js"//打包后输出文件的文件名
    },
    module: {//在配置文件里添加JSON loader
        loaders: [
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',//在webpack的module部分的loaders里进行配置即可
            },
            // 1.0的
            {
                test: /\.css$/,
                // loader: 'style-loader!css-loader?modules'//添加对样式表的处理
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
            },
        ]
    },
    // postcss: [
    //     require('autoprefixer')//调用autoprefixer插件
    // ],
    plugins: [
        new webpack.BannerPlugin("Copyright Flying Unicorns inc."),//在这个数组中new一个就可以了
        // new webpack.LoaderOptionsPlugin({
        //     options: {
        //         postcss: function () {
        //             return [autoprefixer];
        //         }
        //
        //     }
        // }),
    ],
    devServer: {
        contentBase: "./public",//本地服务器所加载的页面所在的目录
        // colors: true,//终端中输出结果为彩色
        historyApiFallback: true,//不跳转
        inline: true,//实时刷新
        port: 8080,//实时刷新
        // 跨域联调配置
        proxy: {
            '/api/': {
                target: 'http://192.168.0.234:80/',
                changeOrigin: true,
                secure: false,
                pathRewrite: {'^/api': '/'}
            }
        }
    }
}