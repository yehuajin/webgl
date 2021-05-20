var fs = require('fs'),
url = require('url'),
  path = require('path'),
  http = require('http');

var root = path.resolve(process.argv[2] || '.'); //服务器的server.js当前的目录
root = path.join(root); //访问页面的文件夹
console.log('Static root dir: ' + root);

//创建服务器

var server = http.createServer(function (request, response) {
  
  var pathname = url.parse(request.url).pathname;
    var filepath = path.join(root, pathname);
  console.log(filepath)
  //获取文件状态

  fs.stat(filepath, function (err, stats) {
    if (!err && stats.isFile()) {
      console.log('200 ' + request.url);

      //发送响应

      response.writeHead(200);

      //将文件流导向response

      fs.createReadStream(filepath).pipe(response);
    } else {
      console.log('404 ' + request.url);

      response.writeHead(404);

      response.end('404 Not Found');
    }
  });
});


server.listen(8081);
