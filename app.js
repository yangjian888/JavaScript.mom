import Koa from 'koa'
import schedule from 'node-schedule'
import fs from 'fs'
import del from 'del'
import fetchData from './fetch/app'
import index  from './routes/index'
import article from './routes/article'
import about  from './routes/about'
import views from 'koa-views'
import convert  from 'koa-convert'
import json  from 'koa-json'
import logger from 'koa-logger'
import _router from 'koa-router'
import _bodyparser from 'koa-bodyparser'

const app = new Koa()
const router = new _router()
const bodyparser = new _bodyparser()


const j = schedule.scheduleJob('53 * * * *', () => {

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
