const os = require("os")
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");                     // html打包插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");              // css单独打包插件
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");           // css压缩插件
const TerserWebpackPlugin = require("terser-webpack-plugin");                 // js压缩插件
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");       // 图片压缩插件



// 获取CPU个数 为下面开启多进程使用
const process = os.cpus().length
// console.log(threads);


/**
 * css-loader 被多处使用  所以在此封装成一个函数 进行复用
 * [].filter(Boolean) 当没有传参的时候参数为undefinded 这时候可以过滤掉;
 * @param {String} pre 其他loader
 * @returns {Array}
 */
function getStyleLoader(pre) {
  return [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          // 能解决大多数样式兼容性问题
          // 必须写在 css-loader后面  less-loader等其他loader前面
          plugins: ["postcss-preset-env"],
        },
      },
    },
    pre,
  ].filter(Boolean);
}

module.exports = {
  // 入口 要求相对路径
  entry: "./src/main.js",
  // 输出 要求绝对路径
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "static/js/main.js",
    // 打包前先清空输出文件夹
    clean: true,
  },
  // 加载器
  module: {
    rules: [
      {
        // loader 通过正则匹配命中之后  就不再继续向下匹配了 提高性能
        oneOf: [
          // loader的配置
          {
            test: /\.css$/i,
            // loader 会从右往左执行
            // css-loader 会将css生成commonjs模块到js中
            // style-loader 会在index.html中动态插入style标签 展示效果
            use: getStyleLoader(),
          },
          {
            test: /\.less$/i,
            use: getStyleLoader("less-loader"),
          },
          {
            test: /\.s[ac]ss$/i,
            use: getStyleLoader("sass-loader"),
          },
          {
            test: /\.styl$/i,
            use: getStyleLoader("stylus-loader"),
          },
          // 处理图片
          {
            test: /\.(png|jpe?g|webp|gif|svg|bmp)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                //   小于下面的kb 就会转base64格式  大于则不转换
                maxSize: 10 * 1024, // 10kb
              },
            },
            generator: {
              // 生成图片的名称
              filename: "static/images/[hash:10][ext][query]",
            },
          },
          // 处理资源文件 类型不够就追加
          {
            test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
            type: "asset/resource",
            generator: {
              // 生成图片的名称
              filename: "static/media/[hash:10][ext][query]",
            },
          },
          // babel js兼容性处理
          {
            test: /\.js$/,
            // exclude include 互斥的 只能存在一个
            // exclude: /(node_modules|bower_components)/,
            include: path.resolve(__dirname, "../src"),
            use: [
              {
                loader: "thread-loader",
                options: {
                  works: process, // 开启多进程 对bable进行处理
                }
              },
              {
                loader: "babel-loader",
                options: {
                  // presets: ["@babel/preset-env"],
                  cacheDirectory: true, // 开启babel缓存
                  cacheCompression: false, // 关闭缓存文件压缩
                  plugins: [
                    "@babel/plugin-transform-runtime" // 减少代码体积  减少重复的辅助代码定义
                  ]
                },
              },
            ]
          },
          // html中img处理
          {
            test: /\.(htm|html)$/i,
            use: {
              loader: 'html-withimg-loader',
              options: {
                esModule: false
              }
            }
          },
        ]
      }
    ],
  },
  // 插件
  plugins: [
    // 打包时 根据public下的index.html生成 html文件 相当于自动引入了
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // 单独打包css文件 而不是嵌入到js中
    new MiniCssExtractPlugin({
      filename: "static/css/main.css",
    }),
    // 以下是压缩相关  webpack4的写的位置 不推荐了
    // // 压缩css
    // new CssMinimizerPlugin(),
    // // 压缩js
    // new TerserWebpackPlugin(
    //   {
    //     parallel: process, // 开启多进程 压缩js
    //   }
    // ),

  ],

  // 压缩相关 webpack5 推荐
  optimization: {
    minimizer: [
      // 压缩css
      new CssMinimizerPlugin(),
      // 压缩js
      new TerserWebpackPlugin(
        {
          parallel: process, // 开启多进程 压缩js
        }
      ),
      // 压缩图片
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,  // 共有imageminMinify和squooshMinify两种模式
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              ["svgo", {
                plugins: [
                  'preset-default',
                  'prefixIds',
                  {
                    name: "sortAttrs",
                    params: {
                      xmlnsOrder: "alphabetical"
                    }
                  }
                ],
              },
              ],

            ],
          },
        },
      })


    ]
  },
  // 模式
  mode: "production",
  // 指出错误在源文件的哪一行哪一列
  devtool: "source-map"
};
