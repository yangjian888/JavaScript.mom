const router = require('koa-router')()
const fs = require('fs')

router.get('/', async(ctx, next) => {

  let body = []

  try {
    body = JSON.parse(fs.readFileSync('./db/list.json', 'utf-8'))
  } catch (err) {
    console.log(err)
    body = [{number: err.code, title: err.errno, created_at: ' no such file or directory' + err.path}]
  }

  ctx.state = {
    title: '文章归档',
    body: body || []
  }

  await ctx.render('list', {})
})
module.exports = router
