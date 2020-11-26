const path = require('path')
const HTMLVebpackPlugin = require('html-webpack-plugin')
const{CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssEkstractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require("terser-webpack-plugin")
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin")
const {VueLoaderPlugin} = require('vue-loader')

const isDev = process.env.NODE_ENV === 'development'

const PATHS = {
    src: path.resolve(__dirname, 'src'),
    dist: path.resolve(__dirname, 'dist'),
    assets: 'assets/'
}

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all',
        }
    }
    if(!isDev){
        config.minimizer = [
           new OptimizeCssAssetsWebpackPlugin(),
           new TerserPlugin()
        ]
    }
    return config
}

const filename = (di, ext) => isDev ? `${di}/[name].${ext}` : `${di}/[name].[hash].${ext}`
const filenameothers = (di, ext) => isDev ? `assets/${di}/[name].${ext}` : `assets/${di}/[name].[hash].${ext}`

module.exports = {
    target: process.env.NODE_ENV === "development" ? "web" : "browserslist",
    context: PATHS.src,
    mode: 'development',
    entry: {
        main:['@babel/polyfill', './index.js'],
    },
    output: {
        filename: filename('js','js'),
        path: PATHS.dist
    },
    resolve:{
        alias:{
            '@': path.resolve(__dirname, 'src/assets'),
            '@js': path.resolve(__dirname, 'src/js'),
            '@scss': path.resolve(__dirname, 'src/scss'),
            'vue$': 'vue/dist/vue.js'
        }
    },
    optimization: optimization(),
    plugins: [
        new VueLoaderPlugin(),
        new HTMLVebpackPlugin({
            filename: 'testrout/index.html',
            template: path.resolve(__dirname, 'src/testrout/index.html'),
            minify: {
                collapseWhitespace: !isDev
            }
        }),
        new HTMLVebpackPlugin({
            template: 'index.html',
            minify: {
                collapseWhitespace: !isDev
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/assets/images'),
                    to: path.resolve(__dirname, 'dist/assets/images/')
                }
            ],
        }),
        new MiniCssEkstractPlugin({
            filename: filename('css','css')
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssEkstractPlugin.loader,
                        options: {
                            publicPath: '',
                        },
                    },
                    'css-loader',
                    'postcss-loader'
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssEkstractPlugin.loader,
                        options: {
                            publicPath: '../',
                        },
                    },
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: filenameothers('images', '[ext]')
                }
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                loader: 'file-loader',
                options: {
                    name: filenameothers('fonts', '[ext]')
                }
            },
            {
                test: /\.xml$/,
                loader: 'xml-loader',
                options: {
                    name: filenameothers('files', '[ext]')
                }
            },
            {
                test: /\.csv$/,
                loader: 'csv-loader',
                options: {
                    name: filenameothers('files', '[ext]')
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            },
            {
                test: /\.vue$/,
                use: {
                    loader: "vue-loader",
                    options: {
                        loader: {
                            scss: 'vue-style-loader!css-loader!sass-loader'
                        }
                    }
                }
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-typescript'
                        ],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            }
        ]
    },
    devServer: {
        port: 3000,
        contentBase: path.resolve(__dirname, './dist'),
        open: true
    },
    devtool: isDev ? 'source-map' : false
}