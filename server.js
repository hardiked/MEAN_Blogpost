var express=require('express');
app=express();
var port=process.env.PORT || 8080;
var morgan=require('morgan');
var mongoose=require('mongoose');
var path=require('path');
var bodyParser=require('body-parser');
var router=express.Router();
var appRoutes=require('./app/routes/api')(router);
var Grid=require('gridfs-stream');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
app.use('/api',appRoutes);
// mongoose.connect('mongodb://localhost:27017/mean_application',function(err){
// // mongoose.connect('mongodb://<username>:<password>@ds155418.mlab.com:55418/mean_application',function(err){
// 	if(err){
// 		console.log(err);
// 		console.log("Error connecting database");
// 	}
// 	else{
// 		console.log("Connected successfully");
// 	}
// });

// var conn = mongoose.createConnection('mongodb://localhost:27017/mean_application');
// conn.once('open', function () {
//   var gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection('uploads');
//   mongoose.connect('mongodb://localhost:27017/mean_application',function(err){
// 	if(err){
// 		console.log(err);
// 		console.log("Error connecting database");
// 	}
// 	else{
// 		console.log("Connected successfully");
// 	}
// });
//   // all set!
// })
app.get('*',function(req,res){
	res.sendFile(path.join(__dirname+'/public/app/views/index.html'));
});


app.listen(port,function(){
	console.log('running on port '+port);
});