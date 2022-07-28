const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require("path");

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
    // 单独打包css文件 而不是嵌入到js中
    new MiniCssExtractPlugin({
      filename: "static/css/main.css",
    }),
    // 压缩css
    new CssMinimizerPlugin(),
  ],

  // 模式
  mode: "production",
};
