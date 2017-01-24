const router = require('koa-router')()
const request = require('co-request')

const md = require('markdown-it')()

const fs = require('fs')


router.get('/', async(ctx, next) => {

  let articleId = ctx.params.articleId

  let body = JSON.parse(fs.readFileSync(`./db/article/${articleId}.json`))
  let mdResult = md.render(body.body)

  ctx.state = {
    title: body.title,
    article: mdResult || '<p>暂无内容</p>',
    url: ctx.req.url
  }

  await ctx.render('article', {})

})

module.exports = router




