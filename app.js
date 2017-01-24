const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const views = require('koa-views')
const co = require('co')
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')()
const logger = require('koa-logger')

const index = require('./routes/index')
const about = require('./routes/about')
const article = require('./routes/article')
const schedule = require('node-schedule')

const request = require('co-request')

const fs = require('fs')

const j = schedule.scheduleJob('21 * * * *', function () {

  console.log('Start~~~')

  //https://api.github.com/repos/hoosin/hoosin.github.io/issues

  //Time to climb the article page, written in the local

  co(function*() {
    let result = yield request({
      url: 'https://api.github.com/repos/hoosin/hoosin.github.io/issues',
      headers: {
        'User-Agent': 'request'
      }
    })
    let body = result.body

    fs.writeFileSync('./db/list.json', body, 'utf-8')


    try {
      let list = JSON.parse(fs.readFileSync('./db/list.json'))

      for (let i = 0; i < list.length; i++) {

        let result = yield request({
          url: `https://api.github.com/repos/hoosin/hoosin.github.io/issues/${list[i].number}`,
          headers: {
            'User-Agent': 'request'
          }
        })

        let body = result.body

        fs.writeFileSync(`./db/article/${list[i].number}.json`, body, 'utf-8')

      }
    } catch (err) {
      console.log(err)
    }


    console.log('The answer to life, the universe, and everything!')

  }).catch(function (err) {
    console.error(err)
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
