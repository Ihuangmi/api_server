const db = require("../db");
const sql = require("../db/sql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

/**
 * 注册
 */
exports.regUser = function (req, res) {
  const { username, password } = req.body;
  // 1、用户名或密码为空
  if (!username || !password) {
    return res.cc("用户名或密码不能为空！");
  }

  // 查询数据库用户名是否已存在
  db.query(sql.selectSQL, [username], (error, results) => {
    if (error) return res.cc(error);

    // 2、账号已存在
    if (results.length) {
      return res.cc("账号已存在！");
    }

    // 3、用户名可用，向数据库增加数据
    // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
    const pass = bcrypt.hashSync(password, 10);
    db.query(sql.insertSQL, [username, pass], (error, results) => {
      if (error) return res.cc(error);

      // SQL 语句执行成功，但影响行数不为 1
      if (results.affectedRows !== 1) {
        return res.cc("注册用户失败，请稍后再试！");
      }

      res.send({
        status: 0,
        message: "注册成功！",
      });
    });
  });
};

/**
 * 登录
 */
exports.login = function (req, res) {
  const { username, password } = req.body;

  // 验证账户密码
  db.query(sql.selectSQL, [username], (error, results) => {
    if (error) return res.cc(error);

    if (results.length < 1) {
      return res.cc("用户不存在！");
    }

    // 比较输入密码与数据库密码是否一致
    const compare = bcrypt.compareSync(password, results[0].password);
    if (!compare) {
      return res.cc("密码错误！");
    }

    // 登录成功
    const tokenStr = jwt.sign({ username: username }, config.jwtSecretKey, {
      expiresIn: "24h",
    });
    res.send({
      status: 0,
      message: "登录成功！",
      token: "Bearer " + tokenStr,
    });
  });
};
