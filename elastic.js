// bin\elasticsearch.bat
// Invoke-RestMethod http://localhost:9200
// var elasticsearch = require('elasticsearch');
// var client = new elasticsearch.Client({
//   host: 'localhost:9200',
//   log: 'trace'
// });	

// client.ping({
//   requestTimeout: 30000,
// }, function (error) {
//   if (error) {
//     console.error('elasticsearch cluster is down!');
//   } else {
//     console.log('All is well');
//   }
// });

// client.update({
//   index: 'user',
//   type: 'user',
//   id: '5vSvSGIBi3LKifDw5bJU',
//   body: {
//     doc:{
//       'email':'jaimin@gmail.com'
//     }
//   }
// }, function (error, response) {
//     console.log("Not able to update "+error);
// }); 

// client.delete({
//   index: 'user',
//   type: 'user',
//   id: '5ab3452e00a15c38d49001f0'
// }, function (error, response) {
//   console.log(error);
// });

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
//     'id':'1',
// 		'username':'hjkfasdas',
// 		'email':'hardik@gmail.com',
// 		'profile':'.././public/assets/images/facebook.png'
// 	}
// },function(err,resp,status){
// 	console.log(resp);
// })

// client.count({
// 	index:'user',
// 	type:'user'
// },function(err,resp,status){
// 	console.log("user: ",resp);
// })

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

var marked=require('marked');
var content=`
# h1
## ht
** ht **
`;
console.log(content)
console.log(marked(content));