let express = require('express');
let app = express();
let path = require('path');

app.use(express.static(path.join(__dirname)));

app.get('/', function(req,res){
  res.sendFile('/pages/map.html');
});
app.get('/pages/map.html', function(req,res){
  res.sendFile('/pages/map.html');
});

app.listen(8000);
/*const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
*/
