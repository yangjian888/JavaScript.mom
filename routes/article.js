const router = require('koa-router')()

const md = require('markdown-it')()

const fs = require('fs')


router.get('/', async(ctx, next) => {

  let articleId = ctx.params.articleId

  let body = []

  try {
    body = JSON.parse(fs.readFileSync(`./db/article/${articleId}.json`, 'utf-8'))
  } catch (err) {
    console.log(err)
    body = {body: '#### 暫無內容'}
  }


  let mdResult = md.render(body.body)


  ctx.state = {
    title: body.title,
    article: mdResult || '<p>暫無內容</p>',
    url: ctx.req.url
  }

  await ctx.render('article', {})

})

module.exports = router




