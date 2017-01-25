const router = require('koa-router')()
const fs = require('fs')
const md = require('markdown-it')()


router.get('/', async(ctx, next) => {

  let body = {}
  let list = {}

  try {
    body = JSON.parse(fs.readFileSync('./db/index.db.json', 'utf-8'))
    list = JSON.parse(fs.readFileSync('./db/github/list.json', 'utf-8'))
  } catch (err) {
    console.log(err)
    list = [{number: err.code, title: err.errno, created_at: ' no such file or directory' + err.path}]
  }



  let mdResult = md.render(body.data)


  console.log(body)
  ctx.state = {
    title: 'hoosin 的私人博客',
    body: mdResult,
    list:list.slice(0,3)
  }

  await ctx.render('index', {})
})
module.exports = router
