var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var LikeSchema=new Schema({
	slug:{type:String,lowercase:true,required:true},
	username:{type:String,required:true},
	liked:{type:Boolean,required:true}
});


module.exports=mongoose.model('Like',LikeSchema);