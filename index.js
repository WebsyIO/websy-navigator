var express = require('express'),
    app = express();

app.use('/resources', express.static(__dirname + '/examples/resources'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use('/', function(req, res){
  res.sendFile(__dirname + '/examples/index.html')
})

app.listen(process.env.PORT || 4000, function(){
  console.log('listening on port 4000');
});
