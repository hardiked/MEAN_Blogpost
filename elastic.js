var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});	

client.ping({
  requestTimeout: 30000,
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});


// client.indices.create({
// 	index:'user'
// },function(err,resp,status){
// 	if(err){
// 		console.log(err);
// 	}
// 	else{
// 		console.log("create",resp);
// 	}
// });

// client.index({
// 	index:'user',
// 	type:'user',
// 	body:{
// 		'username':'jaimink',
// 		'email':'jk@gmail.com',
// 		'profile':'fsdcmsdc'
// 	}
// },function(err,resp,status){
// 	console.log(resp);
// })

client.count({
	index:'user',
	type:'user'
},function(err,resp,status){
	console.log("user: ",resp);
})

// client.search({
// 	index:'user',
// 	type:'user',
// 	body:{
// 		query:{
// 			regexp:{"username":"h.+"}
// 		},
// 	}
// },function(error,response,status){
// 	if(error){
// 		console.log("search error: "+error);
// 	}
// 	else{
// 		console.log("---Reponse---");
// 		console.log(response);
// 		console.log("---hits---");
// 		response.hits.hits.forEach(function(hit){
// 			console.log(hit);
// 		})
// 	}
// });