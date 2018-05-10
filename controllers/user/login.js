var userService = require('../../services/userService'),
    forbidden = require('../../middlewares/forbidden');

// POST /login
exports.post = {
    url: '/login', // override default /user/login
    middlewares: forbidden,
    handler: function (req, res, next) {
        /** 此处为了方便代码测试，做了部分调整 */
        try {
            var username = req.body.username.trim();
        } catch (e) {
            console.error('[ERR] username is invalid');
        }

        if (!username) {
            return next({ _msg: 'invalid username' });
        }

        userService.login({ username });
        res.json({ username });
    }
};
