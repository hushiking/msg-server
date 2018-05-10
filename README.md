# 简易留言板 RESTful API

## 主要用到的 Package

**更多信息请看 `package.json`**

* [Express 4.x](https://github.com/expressjs/express)
* [Express Auto Routes](https://github.com/kenberkeley/express-auto-routes)（自动路由）
* [Lodash](https://github.com/lodash/lodash)
* [UUID](https://github.com/kelektiv/node-uuid)

---

## 环境要求

* Node ≥ 4
* NPM ≥ 3

---

```bash
$ git clone git@github.com:hushiking/msg-server.git
$ npm install / yarn
$ npm start / yarn start

> msg-server@1.0.0 start /Users/hushijin/Public/msg-server
> node app.js

[AutoMount] delete /msg/:msgId
[AutoMount] put /msg/:msgId
[AutoMount] get /msg/:msgId
[AutoMount] get /logout
[AutoMount] post /login
[AutoMount] get /user/
[AutoMount] post /msg/
[AutoMount] get /msg/
[INFO] Msg board RESTful API listening at localhost:8989
```

---

## APIs

参照*上述命令*

---

## JSON 数据格式

```json
// 一条留言信息
{
    "id":"dd8c5110",
    "time":1525851481384,
    "author":"hushiking",
    "title":"freedom"
    "content":"自由国度"
}

// 用户 session
{
    "username":"hushiking"
}
```

---

## 代码测试

> 请确认 [mocha](https://github.com/mochajs/mocha) 是否全局安装
> 若无, `npm i mocha -g`

```bash
$ npm test
...
```
