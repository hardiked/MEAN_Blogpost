var User=require('../models/user');
var Blog=require('../models/blog');
var jwt=require('jsonwebtoken');
var secret='swaminarayan';
var nodemailer=require('nodemailer');
var sgtransport=require('nodemailer-sendgrid-transport');
var multer=require('multer');
var GridFsStorage=require('multer-gridfs-storage');
var Grid=require('gridfs-stream');
var crypto=require('crypto');
var path=require('path');
var mongoose=require('mongoose');
var elasticsearch = require('elasticsearch');

// var upload=multer().single('avatar');


module.exports=function(router){
	// Setup and configuration for elasticsearch
	var es = new elasticsearch.Client({
	  host: 'localhost:9200',
	  log: 'trace'
	});	

	es.ping({
	  requestTimeout: 30000,
	}, function (error) {
	  if (error) {
	    console.error('elasticsearch cluster is down!');
	  } else {
	    console.log('All is well');
	  }
	});

	// Setup and configuration for mongodb
	var gfs;
	var conn = mongoose.createConnection('mongodb://localhost:27017/mean_application');
	conn.once('open', function () {
	  gfs = Grid(conn.db, mongoose.mongo);
	  gfs.collection('uploads');
	  mongoose.connect('mongodb://localhost:27017/mean_application',function(err){
		if(err){
			console.log(err);
			console.log("Error connecting database");
		}
		else{
			console.log("Connected successfully");
		}
	});
	  // all set!
	})

	// Setup and configuration for GridFS
	var filename;
	var storage = new GridFsStorage({
	  url: 'mongodb://localhost:27017/mean_application',
	  file: (req, file) => {
	    return new Promise((resolve, reject) => {
	      crypto.randomBytes(16, (err, buf) => {
	        if (err) {
	          return reject(err);
	        }
	        filename = buf.toString('hex') + path.extname(file.originalname);
	        const fileInfo = {
	          filename: filename,
	          bucketName: 'uploads'
	        };
	        resolve(fileInfo);
	      });
	    });
	  }
	});

	var upload=multer({storage});
	router.post('/upload',upload.single('myfile'),function(req,res){
		if(filename==undefined || filename=="" || filename=="null"){
			res.json({success:false,message:"File field is empty"});
		}
		else{
			var ext=filename.split('.');
			var length=ext.length-1;
			ext=ext[length];
			if(ext=="jpg" || ext=="jpeg" || ext=="png"){
				res.json({"success":true,"filename":filename,message:"Profile picture successfully updated"});
			}
			else{
				res.json({success:false,message:"Invalide file format"})
			}
		}
	});

	//Route for searching
	router.post('/search',function(req,res){

		console.log(req.body.query);
		es.search({
			index:'user',
			type:'user',
			body:{
				query:{
					regexp:{"username":req.body.query+".+"}
				},
			}
		},function(error,response,status){
			var hits=new Array();
			if(error){
				res.json({success:false,message:"Server down Please try later."})
			}
			else{
				console.log("---Reponse---");
				console.log(response);
				console.log("---hits---");
				response.hits.hits.forEach(function(hit){
					console.log(hit);
					hits.push(hit);
				})
				res.json({success:true,hits:hits});
			}
		});
	});

	// Route for updating profile picture link
	router.put('/updateprofile',function(req,res){
		User.findOne({username:req.body.username},function(err,user){
			if(err){
				throw err;
			}
			user.profile=req.body.profile;
			user.save(function(err){
				if(err){
					console.log(err);
				}
				else{
					var id=user._id.toString();
					es.delete({
					  index: 'user',
					  type: 'user',
					  id: id
					}, function (error, response) {
					  console.log("deleted"+ response+ error);
					  es.index({
						index:'user',
						type:'user',
						id:id,
						body:{
							'username':user.username,
							'email':user.email,
							'profile':user.profile
						}
					},function(err,resp,status){
						console.log("created"+err+resp);
						});
					});
					
					res.json({success:true,message:"Profile picture updated successfully",profile:user.profile});
				}
			});
		});
	});

	// Routes for getting all link to all profile pictures
	router.get('/profiles',function(req,res){
		gfs.files.find().toArray(function(err,files){
			if(!files || files.length===0){
				return res.status(404).json({
					err:'No profiles'
				});
			}
			return res.json(files);
		})
	});

	// Route for getting profile picture by link to that image
	router.get('/profiles/:profilename',function(req,res){
		// console.log(req.params.filename)
		gfs.files.findOne({filename:req.params.profilename},function(err,file){
			if(!file || file.length===0){
				return res.status(404).json({
					err:'No file exists'
				});
			}
			if(file.contentType==='image/jpeg' || file.contentType==='image/png'){
				var readstream=gfs.createReadStream(file.filename);
				readstream.pipe(res);
			}
			else{
				res.status(404).json({
					err:'Not an image'
				});
			}
		});
	});

	// Route to get profile of particular user
	router.post('/getprofile',function(req,res){
		if(req.body.username==null || req.body.username==''){
			res.json({success:false,message:""});
		}
		else{
			User.findOne({username:req.body.username}).select('profile').exec(function(err,user){
				if(err){
					throw err;
				}
				if(user){
					console.log("ji"+user.profile);
					res.json({success:true,profile:user.profile});
				}
				else{
					res.json({success:false ,message:"Unknown error occured"});
				}
			});
		}
	});

	// Setup and configuration for nodejs
	var options={
		auth:{
			api_user:'hardik97122',
			api_key:'h97122@MODI'
		}
	}

	var client=nodemailer.createTransport(sgtransport(options));

	// Route for storing blog
	router.post('/blog',function(req,res){
		var blog=new Blog();
		blog.title=req.body.title;
		blog.body=req.body.body;
		var slug=req.body.title.toLowerCase();
		slug=slug.replace(/\s+/g,'-');
		slug=slug.replace(/[^a-z-]/g,'');

		crypto.randomBytes(16,function(err,buf){
			if(err){
				console.log(err);
				return reject(err);
			}
			buf="-"+buf.toString('hex');
			slug=slug+buf;
			res.json({success:true});
		});
	});

	// Route for creating users
 	router.post('/users',function(req,res){
		var user=new User();
		user.username=req.body.username;
		user.password=req.body.password;
		user.email=req.body.email;
		user.profile=".././public/assets/images/facebook.png";
		user.temporarytoken=jwt.sign({
							username:user.username,
							email:user.email
						},secret,{expiresIn:'24h'});
		if(req.body.username==null || req.body.username=='' || req.body.email==null || req.body.email=='' || req.body.password==null || req.body.password==''){
			res.json({success:false,message: 'All the fields are compulsory'});
		}
		else{
			user.save(function(err){
				console.log(err);
				if(err){
					// res.json({success:false,message:err});
						if(err.code==11000){
							if(err.errmsg[69]=="u"){
								res.json({success:false,message:"Username already exists.If you have an account plese try to login"});
							}
							else{
								res.json({success:false,message:"Email already exists.If you have an account plese try to login"});
							}
						}
						else if(err.errors.username){
							res.json({success:false,message: err.errors.username.message});
						}
						else if(err.errors.password){
							res.json({success:false,message:err.errors.password.message});
						}
					
					}
				else{

					var email={
						from:'hmodi2457@gmail.com',
						to:user.email,
						subject:'Activate your account',
						text:'localhost:8080/activate/'+user.temporarytoken,
						html:'Hello <strong> '+user.username +'<strong>,<br><br> Thank you for registering with us.Please the link below to complete your registration.<br><br><a href="http://localhost:8080/activate/'+user.temporarytoken+'">http://localhost:8080/activate/'+user.temporarytoken+'</a>'
					};
					
					client.sendMail(email,function(err,info){
						if(err){
							console.log(err);
						}
						else{
							console.log('message sent '+info.response);
						}
					});

					res.json({success:true,message:'Account regisered! Please check your mailbox to active your account'});
				}
			});
		}
	});

 	// Route for checking username exists or not
	router.post('/checkusername',function(req,res){
		if(req.body.username==null || req.body.username==''){
			res.json({success:false,message:""});
		}
		else{
			User.findOne({username:req.body.username}).select('username').exec(function(err,user){
				if(err){
					throw err;
				}
				if(user){
					res.json({success:false,message:"That username is already taken"});
				}
				else{
					res.json({success:true ,message:"Username is valid"});
				}
			});
		}
	});

	// Route for checking email exists or not
	router.post('/checkemail',function(req,res){
		if(req.body.email==null || req.body.email==''){
			res.json({success:false,message:""});
		}
		else{
			User.findOne({email:req.body.email}).select('email').exec(function(err,user){
				if(err){
					throw err;
				}
				if(user){
					res.json({success:false,message:"That email is already taken"});
				}
				else{
					res.json({success:true,message:"email is valid"});
				}
			});
		}
	});

	// Route for authenticating user
	router.post('/authenticate',function(req,res){
		User.findOne({username:req.body.username}).select('email username password active profile').exec(function(err,user){
			if(err){
				throw err;
			}
			if(!user){
				res.json({success:false,message:"Could not Log you in Please try to Signup"})
			}
			else if(user){
				if(req.body.password==null || req.body.password==''){
					res.json({success:false,message:"Password is required"});
				}
				else{
					var validPassword=user.comparePassword(req.body.password);
					if(validPassword==false){
						res.json({success:false,message:"Could not authenticate password"});
					}
					else if(!user.active){
						res.json({success:"warning",message:"Please check your mailbox to confirm your account!",expire:true});
					}
					else{
						var token=jwt.sign({
							username:user.username,
							email:user.email
						},secret,{expiresIn:'24h'});
						var profile=user.profile;
						res.json({success:true,profile:profile,message:"User authenticated",token:token});
					}
				}
			}
		});
	});

	// Route for resending the verification link to user
	router.post('/resend',function(req,res){
		User.findOne({username:req.body.username}).select('username password active').exec(function(err,user){
			if(err){
				throw err;
			}
			if(!user){
				res.json({success:false,message:"Such user does not exists!"})
			}
			else if(user){
				if(req.body.password==null || req.body.password==''){
					res.json({success:false,message:"Password is required"});
				}
				else{
					var validPassword=user.comparePassword(req.body.password);
					if(validPassword==false){
						res.json({success:false,message:"Could not authenticate password"});
					}
					else if(user.active){
						res.json({success:"warning",message:"Account is already activated!",expire:true});
					}
					else{
						console.log(user);
						res.json({success:true, user:user});
					}
				}
			}
		});
	});

	// Route for updating the token if verification link is resend
	router.put('/resend',function(req,res){
		User.findOne({username:req.body.username},function(err,user){
			if(err){
				throw err;
			}
			user.temporarytoken=jwt.sign({
							username:user.username,
							email:user.email
						},secret,{expiresIn:'24h'});
			user.save(function(err){
				if(err){
					console.log(err);
				}
				else{
					var email={
						from:'hmodi2457@gmail.com',
						to:user.email,
						subject:'Account activation Link request',
						text:'localhost:8080/activate/'+user.temporarytoken,
						html:'Hello <strong> '+user.username +'<strong>,<br><br> Thank you for registering with us.Please the link below to complete your registration.<br><br><a href="http://localhost:8080/activate/'+user.temporarytoken+'">http://localhost:8080/activate/'+user.temporarytoken+'</a>'
					};

					client.sendMail(email,function(err,info){
						if(err){
							console.log(err);
						}
						else{
							console.log('message sent '+info.response);
						}
					});
					res.json({success:true,message:"Activation link has been sent to "+user.email})
				}
			});
		});
	});

	// Route for verifying account
	router.put('/activate/:token',function(req,res){
		User.findOne({temporarytoken:req.params.token}).select('username email temporarytoken active').exec(function(err,user){
			if(err){
				throw err;
			}
			var token=req.params.token;
			jwt.verify(token,secret,function(err,decoded){
				if(err){
					res.json({success:false,message:"Activation link has expire"});
				}
				else if(!user){
					res.json({success:false,message:"a link has expire"});
				}
				else{
					user.temporarytoken=false;
					user.active=true;
					var token=jwt.sign({
							username:user.username,
							email:user.email
						},secret,{expiresIn:'24h'});
					user.save(function(err){
						if(err){
							console.log(err);
						}
						else{
							console.log('yup!');
						}
					});
					var id=user._id.toString();
					es.index({
						index:'user',
						type:'user',
						id:id,
						body:{
							'username':user.username,
							'email':user.email,
							'profile':user.profile
						}
					},function(err,resp,status){
						console.log("here it is "+ resp +err);
					});
					res.json({success:true,message:'Account has been verified!',token:token});
				}
			});
		});
	});

	router.use(function(req,res,next){
		var token=req.body.token || req.body.query || req.headers['x-access-token'];
		if(token){
			jwt.verify(token,secret,function(err,decoded){
				if(err){
					res.json({success:false,message:"Token invalid"});
				}
				else{
					req.decoded=decoded;
					next();
				}
			});
		}
		else{
			res.json({success:false,message:"No token provided"});
		}
	});

	// Route for decoding the token
	router.post('/me',function(req,res){
		res.send(req.decoded);
	});

	return router;
}