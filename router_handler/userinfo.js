const db = require("../db");
const sql = require("../db/sql");
const bcrypt = require("bcryptjs");

/**
 * 查询用户信息
 */
exports.userInfo = function (req, res) {
  // 1、解析参数
  const { id } = req.query;

  // 2、通过参数查询数据库
  db.query(sql.selectbyIdSQL, [id], (err, result) => {
    if (err) return res.cc(err);

    // 3、处理数据，返回结果
    if (!result.length) {
      return res.cc("用户不存在");
    }

    const userinfo = { ...result[0], password: void 0 };
    res.send({
      status: 0,
      userinfo,
      message: "请求成功",
    });
  });
};

/**
 * 修改密码：旧密码与新密码，必须符合密码的验证规则，并且新密码不能与旧密码一致！
 */
exports.updatePwd = function (req, res) {
  const { id, oldPwd, newPwd } = req.body;

  db.query(sql.selectbyIdSQL, [id], (err, results) => {
    if (err) return res.cc(err);

    if (results.length < 1) {
      return res.cc("用户不存在！");
    }

    // 比较输入密码与数据库密码是否一致
    const compare = bcrypt.compareSync(oldPwd, results[0].password);
    if (!compare) {
      return res.cc("原密码错误！");
    }

    // 对新密码进行 bcrype 加密
    const password = bcrypt.hashSync(newPwd, 10);
    db.query(sql.updateSQL, [password, id], (err, result) => {
      if (err) return res.cc(err);

      if (result.affectedRows !== 1) {
        return res.cc("修改失败");
      }

      res.send({
        status: 0,
        message: "修改密码成功",
      });
    });
  });
};
