document.getElementById("btn").onclick = function () {
  // 动态加载 add 函数  import {add} from "./count.js"
  // /* webpackChunkName: "count" */通过注释指定 动态导入的文件打包后生成的文件名
  import(/* webpackChunkName: "count" */ "./count.js")
    .then(({ add }) => {
      console.log(add(3, 5), "动态加载完成");
    })
    .catch((err) => {
      console.log(err, "动态加载失败");
    });
};
