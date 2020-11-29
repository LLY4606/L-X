const fd = require('fd');
fd.readFile('./article/art_cate.html', 'utf8', (err,dataStr) => {
    if (err != null) {
        console.log('出错了------', err);
    } else {
        console.log('文件内容为', dataStr);
    }
    
})