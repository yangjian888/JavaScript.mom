const router = require('koa-router')()
const request = require('co-request')

//https://api.github.com/repos/hoosin/hoosin.github.io/issues


router.get('/', async(ctx, next) => {

  let result = await request({
    url: 'https://api.github.com/repos/hoosin/hoosin.github.io/issues',
    headers: {
      'User-Agent': 'request'
    }
  })

  console.log(result)

  let body = JSON.parse(result.body)

  ctx.state = {
    title: 'hoosin (@hoosin) blogs',
    body: body
  }

  await ctx.render('index', {})
})
module.exports = router
