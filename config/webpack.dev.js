const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

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
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          // options: {
          //   presets: ["@babel/preset-env"],
          // },
        },
      },
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
  },
  // 模式
  mode: "development",
};
