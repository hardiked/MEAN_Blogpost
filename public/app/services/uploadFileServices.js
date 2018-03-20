angular.module('uploadFileService',[])

.service('uploadFile',function($http,$rootScope){
	this.upload=function(file){
		var fd=new FormData();
		fd.append('myfile',file.upload);
		fd.append('username',$rootScope.username);
		return $http.post('/api/upload',fd,{
			transformRequest:angular.identity,
			headers:{ 'Content-Type':undefined }
		});
	};
});