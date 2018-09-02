const app=require('./app');
const http=require('http');
var server=http.createServer(app);
const mongoose = require('./db/connectDB');
const config=require('./config/config');
const port=process.env.PORT;
server.listen(port,function(){
	console.log("Server running at port "+port);
});