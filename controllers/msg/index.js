var msgService = require('../../services/msgService'),
    authentication = require('../../middlewares/authentication');

// GET /msg
exports.get = {
    handler: function (req, res, next) {
        var queryBody;
        if (req.query.author) {
            queryBody = { author: req.query.author }
        }
        var pageIndex = ~~req.query.pageIndex || 1,
            quantity = ~~req.query.quantity || 10;

        if (pageIndex < 1) pageIndex = 1;
        if (quantity < 1) quantity = 10; // 默认每页10条

        var pagingBody = {
            index: pageIndex,
            quantity: quantity
        };

        res.json(msgService.find({ query: queryBody, paging: pagingBody }));
    }
}

// GET /msg/:msgId (获取单个消息)
// `exports.get` 已经被用了, 改为大写
exports.GET = {
    params: ':msgId',
    handler: function (req, res, next) {
        res.json(msgService.findById(req.params.msgId));
    }
}

// post new message
// POST /msg
exports.post = {
    middlewares: authentication,
    handler: function (req, res, next) {
        var newMsg = msgService.add({
            author: req.session.userData.username,
            title: req.body.title,
            content: req.body.content
        });

        res.json(newMsg);
    }
}

// modify message
// PUT /msg/:msgId
exports.put = {
    params: ':msgId',
    middlewares: authentication,
    handler: function (req, res, next) {
        var modiMsg = msgService.modi({
            id: req.params.msgId,
            author: req.session.userData.username,
            title: req.query.tilte,
            content: req.body.content
        });

        if (!modiMsg) {
            return next({
                _status: 403,
                _msg: 'You dont have the authority to modify this message'
            });
        }

        res.json(modiMsg);
    }
}

exports.delete = {
    params: ':msgId',
    middlewares: authentication,
    handler: function (req, res, next) {
        var hasDeleted = msgService.del({
            id: req.params.msgId,
            author: req.session.userData.username
        })

        if (!hasDeleted) {
            return next({
                _status: 403,
                _msg: 'You dont have the authority to delete / ' +
                    'this message had been deleted'
            })
        }

        res.json(true);
    }
}
