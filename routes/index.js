const router = require('koa-router')()

router.get('/', async function (ctx, next) {
  ctx.state = {
    title: 'JS之母'
  }

  await ctx.render('index', {
  })
})
module.exports = router
