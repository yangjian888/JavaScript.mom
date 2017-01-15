const router = require('koa-router')()

router.get('/', async(ctx, next) => {
  ctx.state = {
    title: '关于 hoosin'
  }
  await ctx.render('about', {})

})

module.exports = router


