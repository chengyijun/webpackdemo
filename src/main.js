import add1 from "./js/m1";
import add2 from "./js/m2";
import "./js/m3";

// 引入的目的是为了打包
import "./css/index.css";
import "./css/index2.less";
import "./css/index3.sass";
import "./css/index4.scss";
import "./css/index5.styl";

import "./css/iconfont.css";

console.log(add1(1, 2));
console.log(add2(3, 7));

// js默认是不能热更新的  所以需要手动
// accpet() 第二个参数可以接受一个回调函数
if (module.hot) {
  module.hot.accept("./js/m1.js");
  module.hot.accept("./js/m2.js", function () {
    console.log("m2模块更新了");
  });
}
