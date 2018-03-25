var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');
var validate=require('mongoose-validator');


var usernameValidator=[
	validate({
		validator:'isLength',
		arguments:[3,25],
		message:"Username should be 3 to 25 characters long"
	}),
	validate({
		validator:'isAlphanumeric',
		message:"Username must contain letters and numbers only"
	})
];

var passwordValidator=[
	validate({
		validator:'matches',
		arguments:/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
		message:"Password must have atleast one lowercase,one uppercase,one number and one special symbol and 8-35 character long"
	})
];

var UserSchema=new Schema({
	username:{type:String,lowercase:true,required:true,unique:true,validate:usernameValidator},
	password:{type:String,required:true,validate:passwordValidator,select:false},
	email:{type:String,required:true,lowercase:true,unique:true},
	profile:{type:String,required:false},
	active:{type:Boolean,required:true,default:false},
	temporarytoken:{type:String,required:true},
	blogs:{type:Array,required:false}
});

UserSchema.pre('save',function(next){
	var user=this;
	if(!user.isModified('password')){
		return next();
	}
	bcrypt.hash(user.password,null,null,function(err,hash){
		if(err){
			return next(err);
		}
		user.password=hash;
		next();
	});
});

UserSchema.methods.comparePassword=function(password){
	return bcrypt.compareSync(password,this.password);
}

module.exports=mongoose.model('User',UserSchema);