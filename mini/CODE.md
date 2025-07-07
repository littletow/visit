# 经典代码

## 上传章节
```javascript
const cloud = require('wx-server-sdk')

cloud.init()

const fs = require('fs')
const path = require('path')
const db = cloud.database()
exports.main = async (event, context) => {
  var alist = []
  var bid = event.bid
  var tag = event.tag

  await db.collection('articles').where({
    bid:bid,

  }).get().then(res => {
    console.log(res.data)
    alist = res.data
  })
  for (var i=0;i< alist.length;i++){
    const fileStream = fs.createReadStream(path.join(__dirname, 'files/' + alist[i].aid+'.md'))
     await cloud.uploadFile({
      cloudPath: tag +'/' + alist[i]._id + '.md',
      fileContent: fileStream,
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }
  return true
  
}
```
