const express = require("express");
const app = express();
const cors = require("cors");
const joi = require("joi");
// 导入路由模块
const userRouter = require("./router/user");
const userinfoRouter = require("./router/userinfo");
// 解析 token 的中间件
const expressJWT = require("express-jwt").expressjwt;
const config = require("./config");

// 配置 cors 中间件解决接口跨域问题
app.use(cors());

// 解析 URL-encoded 表单数据
app.use(express.urlencoded({ extended: false }));

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(
  expressJWT({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless({
    path: [/^\/api\//],
  })
);

// 处理响应失败状态中间件
app.use((req, res, next) => {
  // 成功：status=0；失败：status=1
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

// 注册路由模块，并添加统一的访问前缀 /api
app.use("/api", userRouter);
app.use("/my", userinfoRouter);

/**
 * 错误级别中间件，捕获接口的异常错误
 * 注意：错误级别中间件必须注册在所有路由之后，而其他中间件必须在路由之前
 */
app.use((err, req, res, next) => {
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err);

  // 身份认证失败
  if (err.name === "UnauthorizedError") return res.send(err);

  // 其他错误
  res.send(err);
});

app.listen(3007, () => {
  console.log("server running at http://127.0.0.1:3007");
});
