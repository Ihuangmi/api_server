const express = require("express");

// 创建路由对象
const router = express.Router();

const expressJoi = require("@escook/express-joi");
const { reset_pwd } = require("../schema/userinfo");

// 为了保证 路由模块 的纯粹性，所有的 路由处理函数，必须抽离到对应的 路由处理函数模块 中
const userHandler = require("../router_handler/userinfo");

// 查询用户信息
router.get("/userinfo", userHandler.userInfo);

// 修改密码
router.post("/updatepwd", expressJoi(reset_pwd), userHandler.updatePwd);

// 导出路由对象
module.exports = router;
