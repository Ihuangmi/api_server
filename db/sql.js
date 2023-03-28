/**
 * 查询数据库用户名是否已存在
 */
exports.selectSQL = "select * from users where username=?";

/** 通过id查询用户信息 */
exports.selectbyIdSQL = "select * from users where id=?";

/**
 * 向数据库增加数据
 */
exports.insertSQL = "insert into users (username, password) values (?, ?)";

/**
 * 修改密码
 */
exports.updateSQL = "update users set password=? where id=?";
