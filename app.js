var flatiron = require('flatiron'),
    path = require('path'),
    app = flatiron.app,
    fs = require('fs');
var mime = require('mime');
var url = require('url');


app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

app.use(flatiron.plugins.http);



app.router.get('/', function () {
    console.log('got request');
      var template = fs.readFileSync(__dirname + '/index.html', "utf-8");
        
            //console.log('data:'+template);
              this.res.writeHead(200, { 'Content-Type': 'text/html' })
             this.res.end(template);
        console.log('sent index.html');
    
 
});
app.router.get('/public/*/*/*.*', function () {
      var path = url.parse(this.req.url).pathname;
      console.log('serving files.....' + path);
      var template = fs.readFileSync(__dirname + path);
      this.res.writeHead(200, { 'Content-Type': mime.lookup(path)  });
      this.res.end(template);
  });


app.start(3000);

/////socket
var io = require('socket.io').listen(app.server,{'log':false});

io.sockets.on('connection', function (socket) {
    console.log('Connection established');
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
   socket.on('getFile',function(msg){
      console.log('got getValue ');
      var content = fs.readFileSync('testEdit.js');
      console.log('Content:'+content);
      socket.emit('getFile',{'content':content.toString()});
  });
  socket.on('autoSave',function(msg){
      console.log('got setValue msg:'+JSON.stringify(msg));
      fs.writeFile(msg.fileName, msg.content, 'utf8');
  });
});