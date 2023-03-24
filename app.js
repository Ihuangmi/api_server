const express = require("express");
const app = express();

// 配置 cors 中间件解决接口跨域问题
const cors = require("cors");
app.use(cors());

// 解析 URL-encoded 表单数据
app.use(express.urlencoded({ extended: false }));

// 导入路由模块
const userRouter = require("./router/user");
// 注册路由模块，并添加统一的访问前缀 /api
app.use("/api", userRouter);

app.listen(3007, () => {
  console.log("server running at http://127.0.0.1:3007");
});
