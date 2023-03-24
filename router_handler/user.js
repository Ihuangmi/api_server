const db = require("../db");

/**
 * 查询用户名是否存在
 */
function verifyAccount(username, cb) {
  const sql = "select * from users where username=?";
  db.query(sql, [username], (error, results) => {
    if (results.length) {
      cb(results);
    }
  });
}

/**
 * 注册
 */
exports.regUser = function (req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.send({
      status: 1,
      message: "用户名或密码不能为空！",
    });
  }

  verifyAccount(username, (results) => {
    return res.send({
      status: 1,
      message: "账号已存在！",
    });
  });

  const sql = "insert into users (username, password) values (?, ?)";
  db.query(sql, [username, password], (error, results) => {
    if (error) throw error;
    if (results.affectedRows === 1) {
      res.send({
        status: 0,
        message: "注册成功！",
      });
    }
  });
};

/**
 * 登录
 */
exports.login = function (req, res) {
  const { username, password } = req.body;
  console.log("🚀 ~ file: user.js:51 ~ password:", password);
  // 验证账户密码
  verifyAccount(username, (results) => {
    console.log("🚀 ~ file: user.js:54 ~ verifyAccount ~ results:", results);
    if (results.password !== password) {
      return res.send({
        status: 1,
        message: "密码错误！",
      });
    }
    return res.send({
      status: 0,
      message: "登录成功",
      // token: tokenStr,
    });
  });

  // // 3、调用 jwt.sign() 生成 JWT 字符串，三个参数分别是：用户信息对象，加密密钥，配置对象
  // const tokenStr = jwt.sign({ username: username }, secretKey, {
  //   expiresIn: "3000s",
  // });
};
