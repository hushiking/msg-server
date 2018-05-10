var request = require('supertest'),
    should = require('chai').should(),
    assert = require('chai').assert,
    async = require('async'),
    app = require('../app'),
    api = request(app),
    userService = require('../services/userService');

describe('# User Authentication Test #', function () {
    before(function () {
        userService.logout();
    });

    describe('## Under unlogin state ##', function () {
        it('user session should be null', function (done) {
            api.get('/user')
                .expect(200, function (err, res) {
                    should.equal(res.body, null);
                    done(err);
                })
        });

        it('forbid to access POST/PUT/DELETE /msg', function (done) {
            async.series([
                function (cb) { api.post('/msg').expect(401, cb) },
                function (cb) { api.put('/msg/:msgId').expect(401, cb) },
                function (cb) { api.del('/msg/:msgId').expect(401, cb) }
            ], done)
        });

        it('forbid to logout', function (done) {
            api.get('/logout').expect(401, done);
        });
    });

    describe('## Under login state ##', function () {
        /** 判断传入的username为空的情况 */
        it('login test null', function (done) {
            api.post('/login')
                .expect(200, function (err, res) {
                    assert.deepEqual(res.body, { _code: 1, _msg: "invalid username" }, '[ok] username is invalid');
                    done(err);
                })
        })
        it('login test', function (done) {
            api.post('/login')
                .send({ username: 'hu' })
                .expect(200, function (err, res) {
                    res.body.username.should.equal('hu');
                    done(err);
                })
        });

        it('forbid to login again', function (done) {
            api.post('/login')
                .send({ username: 'whoever' })
                .expect(403, done);
        });

        it('logout test', function (done) {
            api.get('/logout').expect(200, done);
        });
    });

    describe('## Unknown url ##', function() {
        it('page not found', function (done) {
            api.get('/hu')
                .expect(404, done);
        })
    })
});
