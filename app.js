const Koa = require('koa')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa-cors')
const secret = require('./config/secret')


// add jwt
const koaJwt = require('koa-jwt')
const jwt = require('jsonwebtoken') // jwt-simple

const app = new Koa()



const admin = require('./routes/admin/index')
const index = require('./routes/index')

// error handler
onerror(app)

app.use(cors()) //使用cors

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use(function(ctx, next){
  return next().catch((err) => {
      if (401 == err.status) {
          ctx.status = 401;
          ctx.body = {
            isSuccess: false,
            message: 'token错误,请重新登录'
          };
      } else {
          throw err;
      }
  });
});

// 过滤不需要jwt验证 -- json web token
app.use(koaJwt({secret: secret.sign}).unless({
  path:[
    /^\/api\/v1\/admin\/login/,
    /^\/api\/v1\/articlelist/,
    /^\/api\/v1\/article\/detail/,
    /^\/api\/v1\/article\/mylike/,
    /^\/api\/v1\/article\/myread/,
    /^\/api\/v1\/messagelist/,
    /^\/api\/v1\/message\/add/,
    /^\/api\/v1\/sign_up/,
    /^\/api\/v1\/sign_in/,
    /^\/api\/v1\/comments/,
    /^\/api\/v1\/comments\/add/,
    /^\/api\/v1\/comments\/reply/,
    /^\/api\/v1\/uploadfile/
  ]
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(admin.routes(), admin.allowedMethods())
app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
