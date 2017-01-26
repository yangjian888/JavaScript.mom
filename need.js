import del from 'del'
import fs from 'fs'
import fetchData from './fetch/app'


console.log('Start~~~')

fs.readdir('./db/article', (err, files) => {

  if (err || files.length === '0') {

    fetchData.list()

  } else if (files.length !== '0') {

    del(['./db/article']).then(paths => {
      console.log('Deleted files and folders:\n', paths.join('\n'))
      fetchData.list()
    })

  }

})
