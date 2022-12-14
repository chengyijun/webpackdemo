const os = require("os")
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 获取CPU个数 为下面开启多进程使用
const process = os.cpus().length
module.exports = {
  // 入口 要求相对路径
  entry: "./src/main.js",
  // 输出 要求绝对路径
  output: {
    // 开发环境没有输出物
    path: undefined,
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
            use: ["style-loader", "css-loader"],
          },
          {
            test: /\.less$/i,
            use: ["style-loader", "css-loader", "less-loader"],
          },
          {
            test: /\.s[ac]ss$/i,
            use: ["style-loader", "css-loader", "sass-loader"],
          },
          {
            test: /\.styl$/i,
            use: ["style-loader", "css-loader", "stylus-loader"],
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
          // babel兼容性处理
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
  ],
  // 开发服务器 内存中编译打包 不会输出dist
  // 启动命令为  npx webpack serve
  devServer: {
    host: "localhost",
    port: "3000",
    open: true,
    hot: true, // 热更新 hot module replace (HMR) 默认是开启的
  },
  // 模式
  mode: "development",
  // 指出错误在源文件的哪一行 而不是编译后文件的哪一行
  devtool: "cheap-module-source-map"
};
