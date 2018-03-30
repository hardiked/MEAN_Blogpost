var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var BookmarkSchema=new Schema({
	slug:{type:String,lowercase:true,required:true},
	username:{type:String,required:true},
	bookmarked:{type:Boolean,required:true}
});


module.exports=mongoose.model('Bookmark',BookmarkSchema);