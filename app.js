const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const views = require('koa-views')
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')()
const logger = require('koa-logger')
const index = require('./routes/index')
const about = require('./routes/about')
const article = require('./routes/article')
const schedule = require('node-schedule')
const del = require('del')
const fs = require('fs')

const fetchData = require('./fetch/app')


const j = schedule.scheduleJob('53 * * * *', function () {

  console.log('Start~~~')

  fs.readdir('./db/article', (err, files) => {

    if (err || files.length === '0') {

      fetchData.list()

    } else if (files.length !== '0') {

      del(['./db/article']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'))
        fetchData.list()
      })

    }

  })

})

// middlewares
app.use(convert(bodyparser))
app.use(convert(json()))
app.use(convert(logger()))
app.use(convert(require('koa-static')(__dirname + '/public')))

app.use(views(__dirname + '/views', {
  extension: 'jade'
}))


// logger
app.use(async(ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

router.use('/', index.routes(), index.allowedMethods())
router.use('/about', about.routes(), about.allowedMethods())
router.use('/article/:articleId', article.routes(), article.allowedMethods())


app.use(router.routes(), router.allowedMethods())
// response

app.on('error', (err, ctx) => {
  console.log(err)
  log.error('server error', err, ctx)
})


module.exports = app
