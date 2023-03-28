const express = require("express");

// 创建路由对象
const router = express.Router();

// 为了保证 路由模块 的纯粹性，所有的 路由处理函数，必须抽离到对应的 路由处理函数模块 中
const userHandler = require("../router_handler/user");

// 1. 导入验证表单数据的中间件
const expressJoi = require("@escook/express-joi");
// 2. 导入需要的验证规则对象
const { reg_login_schema } = require("../schema/user");

// 注册
router.post("/register", expressJoi(reg_login_schema), userHandler.regUser);

// 登录
router.post("/login", expressJoi(reg_login_schema), userHandler.login);

router.get("/user", function (req, res) {
  res.send("user details");
});

// 导出路由对象
module.exports = router;
