### 说明
 - node+koa2+mysql实现的个人博客
 - 若要运行该项目请先确保本地已经安装过mysql、node环境
 - 适合于新手和有经验的童鞋nodejs，koa

### 技术栈
- 服务端：Nodejs，框架Koa2
- 前端和后台模板：Vue.js  前台UI框架 view-design
- 数据库：MySQL
- 完整包含技术：Node.js、 Koa2、 MySQL、 JWT、 Vue.js.

- 项目说明
    - 前后端分离，服务端采用koa2和nodejs做接口，前端和后台用vue
    - 文章列表模块，用户评论功能，用户评论回复功能，但需要先注册登录
    - 注册模块需要上传用户头像
    - 对网站技术有什么疑问或建议可留言告诉我
    - 网站持续优化中...

### 下载项目
- git地址： 
``` javascript
https://github.com/dcq2016/koa2-node-blog
```
- 可下载压缩包或node下载 
``` javascript
`git clone https://github.com/dcq2016/koa2-node-blog.git`
```
### 运行项目
- 安装数据库存
    - 安装mysql数据库(此处省略1000字)
    - 安装mysql可视化工具,推荐Navicat
    - 创建数据库名称可自定： 数据库配置文件在根目录下的config/db.js
    - 创建表，sql文件在中根目录下的config/dean_blog.sql
    - 进入文章表 act_article 初始化加入几条数据
- 启动项目
    - 1.进入根目录执行  `npm install` 后再执行 `npm run start`  (运行后端接口）
    - 2.进入web目录执行  `npm install` 再执行  `npm run serve` （前端项目）

