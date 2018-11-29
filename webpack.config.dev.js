/* eslint-disable prefer-template*/
import webpack from 'webpack';

const HtmlWebpackPlugin = require('html-webpack-plugin');
import {DEV_PORT} from './tools/constants';

process.noDeprecation = true;

export default {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        `webpack-dev-server/client?http://localhost:${DEV_PORT}`,
        'webpack/hot/only-dev-server',
        './src/index'
    ],
    output: {
        filename: 'dev-bundle.js',
        publicPath: '/'
    },
    target: 'web',
    plugins: [
        new webpack.LoaderOptionsPlugin({
            noInfo: true,
            debug: true,
            minimize: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            template: './src/index.html'
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.less']
    },
    module: {
        rules: [
            {
                test: /(\.js$|\.jsx?$)/,
                loader: 'babel-loader',
                exclude: [/node_modules/],
                options: {
                    sourceMap: true
                }
            },
            {
                test: /(\.css|\.less)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    }
};
