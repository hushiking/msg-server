var _ = require('lodash'),
    uuid = require('uuid'),
    DbService = require('./dbService');

function MsgService() { }
MsgService.prototype = new DbService('../db/msg.json');

MsgService.prototype.find = function (condition) {
    var queryBody = condition.query,
        pageIndex = condition.paging.index,
        quantity = condition.paging.quantity;

    var msgs = this.read();

    /** 消息查询并排序 */
    if (queryBody) {
        msgs = _.filter(msgs, queryBody);
    }
    msgs = _.orderBy(msgs, ['time'], ['desc']);

    /** 分页 */
    var startIndex = (pageIndex - 1) * quantity,
        endIndex = startIndex + quantity;

    msgs = msgs.filter(function (msg, index) {
        return startIndex <= index && index < endIndex;
    })

    return msgs;
}

/**
 * 根据消息 id 查找消息
 * @param {uuid} id 消息 id
 * @return {Object} 匹配的消息对象
 */
MsgService.prototype.findById = function (id) {
    return _.find(this.read(), { id }) || null;
}

/**
 * 添加消息
 * @param {Object} msgBody { author: {String}, title: {String} content: {String} }
 * @return {Object} newMsg
 */
MsgService.prototype.add = function (msgBody) {
    var newMsg = Object.assign({
        id: uuid.v1().substr(0, 8),
        time: Date.now()
    }, msgBody);
    var msgs = this.read() || [];
    msgs.push(newMsg);

    this.save(msgs);
    console.info('[INFO] Successfully added');
    return newMsg;
}

/**
 * 
 * @param {Object} authBody { id: {uuid, Msg ID}, author: {String} }
 * @return {Boolean} isAccessiable
 */
MsgService.prototype._auth = function (authBody) {
    var targetMsg = this.findById(authBody.id);

    if (!targetMsg || targetMsg.author !== authBody.author) {
        console.info('[WARN] Record not found or auth failed');
        return false;
    }

    return true;
}

/**
 * 
 * @param {Object} authBody {id: {uuid, Msg ID}, author: {String}}
 * @return {Boolean} hasDeleted
 */
MsgService.prototype.del = function (authBody) {
    if (!this._auth(authBody)) return;

    this.save(_.reject(this.read(), { id: authBody.id }));
    console.info('[INFO] Successfully deleted');
    return true;
}

MsgService.prototype.modi = function (modiMsgBody) {
    if (!this.del(_.omit(modiMsgBody, ['title', 'content']))) return;

    var modiMsg = this.add(modiMsgBody);
    console.info('[INFO] Successfully modified');
    return modiMsg;
}

// singleton
module.exports = new MsgService();
