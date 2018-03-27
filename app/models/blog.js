var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var BlogSchema=new Schema({
	slug:{type:String,lowercase:true,required:true},
	username:{type:String,required:true},
	title:{type:String,required:true},
	body:{type:String,required:true},
	markedContent:{type:String,required:true},
	displayText:{type:String,required:true},
	date:{type:Date,required:false}
});


module.exports=mongoose.model('Blog',BlogSchema);