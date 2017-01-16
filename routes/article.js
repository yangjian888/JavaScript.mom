const router = require('koa-router')()
const request = require('co-request')

const md = require('markdown-it')()


router.get('/', async(ctx, next) => {

  let articleId = ctx.params.articleId

  let result = await request({
    url: `https://api.github.com/repos/hoosin/hoosin.github.io/issues/${articleId}`,
    headers: {
      'User-Agent': 'request'
    }
  })

  let body = JSON.parse(result.body)

  let mdResult = md.render(body.body)

  ctx.state = {
    title: body.title,
    article: mdResult || '<p>暂无内容</p>'
  }

  await ctx.render('article', {})

})

module.exports = router




