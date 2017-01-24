const router = require('koa-router')()
const fs = require('fs')

router.get('/', async(ctx, next) => {

  let body = JSON.parse(fs.readFileSync('./db/list.json'))

  ctx.state = {
    title: 'hoosin (@hoosin) blogs',
    body: body
  }

  await ctx.render('index', {})
})
module.exports = router
