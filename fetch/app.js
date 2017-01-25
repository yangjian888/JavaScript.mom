const co = require('co')
const request = require('co-request')
const fs = require('fs')


const fetchData = {}

fetchData.list = () => {

  // mkdir db folder
  fs.mkdirSync('./db/github/article', '0777')
  console.log('mkdir db')

  co(function*() {
    try {

      // fetch api => https://api.github.com/repos/hoosin/hoosin.github.io/issues
      let result = yield request({
        url: 'https://api.github.com/repos/hoosin/hoosin.github.io/issues',
        headers: {
          'User-Agent': 'request'
        }
      })

      let body = result.body
      fs.writeFileSync('./db/github/list.json', body, 'utf-8')

      console.log('list done!')

      fetchData.article()


    } catch (err) {
      console.log(err)
    }


  }).catch((err) => {
    console.error(err)
  })
}

fetchData.article = () => {


  co(function*() {
    try {

      let list = JSON.parse(fs.readFileSync('./db/github/list.json'))

      for (let i = 0; i < list.length; i++) {

        let result = yield request({
          url: `https://api.github.com/repos/hoosin/hoosin.github.io/issues/${list[i].number}`,
          headers: {
            'User-Agent': 'request'
          }
        })

        let body = result.body

        fs.writeFileSync(`./db/github/article/${list[i].number}.json`, body, 'utf-8')

        console.log(`article ${list[i].number} done!`)


      }

    } catch (err) {
      console.log(err)
    }


  }).catch((err) => {
    console.error(err)
  })

}


module.exports = fetchData

