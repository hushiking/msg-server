var fs = require('fs'),
    path = require('path');

function DbService(relativePath) {
    this.db = path.resolve(__dirname, relativePath);
}

DbService.prototype.isAvailable = function () {
    return fs.existsSync(this.db);
}

DbService.prototype.read = function () {
    if (!this.isAvailable()) return null;

    var contentToStr = fs.readFileSync(this.db, 'utf-8'),
        content;

    try {
        content = JSON.parse(contentToStr);
    } catch (e) {
        this.delDb();
        console.error('[ERR] JSON.parse failed, deleted ' + this.db);
    }

    return content || null;
}

DbService.prototype.save = function (data) {
    var strToSave = JSON.stringify(data);

    if (!strToSave) return;
    fs.writeFileSync(this.db, strToSave, 'utf-8');
}

DbService.prototype.delDb = function () {
    try {
        fs.unlinkSync(this.db);
    } catch (e) {
        console.error('DB file does not exist')
    }
}

module.exports = DbService;
