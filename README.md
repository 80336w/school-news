# 校园新闻网站

这是一个纯 HTML + CSS + JavaScript 的新闻网站 demo，满足以下需求：

- 首页显示已发布新闻
- 支持投稿新闻
- 支持自定义上传配图
- 允许任何人提交，但默认进入审核状态
- 管理员页面可审核通过/拒绝
- 数据保存在浏览器本地 `localStorage` 中

## 运行方式

直接打开以下文件即可：

- `index.html`：首页
- `submit.html`：投稿页
- `admin.html`：审核页

## 说明

这个版本是静态前端 demo，适合快速原型和演示。它没有真实后端与数据库，因此：

- 文章数据保存在浏览器本地
- 任何人在本地浏览器中都可以模拟投稿
- 适合 HTML/JavaScript 入门教学或小型展示

如果你后续要做真实多人协作版本，需要接入：

- 后端服务
- 数据库
- 用户登录
- 图片上传存储

## 文件结构

```text
.
├── index.html
├── submit.html
├── admin.html
├── style.css
├── script.js
├── README.md
```
