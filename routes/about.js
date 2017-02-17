const router = require('koa-router')()
const md = require('markdown-it')()
const fs = require('fs')


router.get('/', async(ctx, next) => {

  let body = {}

  try {
    body = JSON.parse(fs.readFileSync('./db/aboutme.db.json', 'utf-8'))
  } catch (err) {
    console.log(err)
  }


  let mdResult = md.render(body.data)
  let mbPing = md.render(body.ping)


  ctx.state = {
    title: '關於 hoosin',
    body: mdResult,
    ping: mbPing
  }

  await ctx.render('about', {})

})

module.exports = router
