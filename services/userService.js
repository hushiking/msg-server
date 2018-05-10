var DbService = require('./dbService');

function UserService() {}
UserService.prototype = new DbService('../db/user.session');

/**
 * @return {Object/Null} userData/null(unautherized)
 */
UserService.prototype.isLogin = function () {
    return this.read();
}

/**
 * @param  {Object} userData
 */
UserService.prototype.login = function (userData) {
    var curUser = this.read();
    /** 此处if代码不会执行，被forbidden.js中间件拦截了 */
    if (curUser) {
        console.info('[INFO] You had already logged in');
        return;
    }
    this.save(userData);
}

UserService.prototype.logout = function () {
    this.delDb();
}

module.exports = new UserService();
