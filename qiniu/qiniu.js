import fs from 'fs'
import qiniu from 'qiniu'
import config from './config'


qiniu.conf.ACCESS_KEY = config.ACCESS_KEY
qiniu.conf.SECRET_KEY = config.SECRET_KEY

const bucket = config.bucket


const uptoken = (bucket, key) => {
  let putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key)
  return putPolicy.token()
}


const uploadFile = (uptoken, key, localFile) => {
  let extra = new qiniu.io.PutExtra()
  qiniu.io.putFile(uptoken, key, localFile, extra, (err, ret) => {
    if (!err) {
      // 上传成功， 处理返回值
      console.log(ret.hash, ret.key, ret.persistentId)
    } else {
      // 上传失败， 处理返回代码
      console.log(err)
    }
  })
}


const doPic = () => {


  let path = ['images', 'javascripts', 'stylesheets']

  for (let i = 0; i < path.length; i++) {

    fs.readdir('public/' + path[i], (err, files) => {

      if (err || files.length === '0') {

        console.log('no files')

      } else if (files.length !== '0') {

        console.log(path[i] + '/' + files)

        //上传到七牛后保存的文件名
        const key = path[i] + '/' + files

        //要上传文件的本地路径
        const filePath = 'public/' + path[i] + '/' + files

        //生成上传 Token
        const token = uptoken(bucket, key)


        uploadFile(token, key, filePath)

      }

    })

  }

}

module.exports = doPic







