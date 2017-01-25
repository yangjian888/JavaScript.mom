const del = require('del')
const fs = require('fs')
const fetchData = require('./fetch/app')


console.log('Start~~~')

fs.readdir('./db/github/article', (err, files) => {

  if (err || files.length === '0') {

    fetchData.list()

  } else if (files.length !== '0') {

    del(['./db/github/article']).then(paths => {
      console.log('Deleted files and folders:\n', paths.join('\n'))
      fetchData.list()
    })

  }

})
