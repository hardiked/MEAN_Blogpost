angular.module('userServices',[])

.factory('User',function($http){
	userFactory={};

	// User.create(regData)
	userFactory.create=function(regData){
		return $http.post('/api/users',regData);
	}

	userFactory.checkUsername=function(regData){
		return $http.post('/api/checkusername',regData);
	}

	userFactory.checkEmail=function(regData){
		return $http.post('/api/checkemail',regData);
	}

	userFactory.activateAccount=function(token){
		return $http.put('/api/activate/'+token);
	}

	userFactory.checkCredentials=function(loginData){
		return $http.post('/api/resend',loginData);
	}

	userFactory.resendLink=function(username){
		return $http.put('/api/resend',username)
	}

	return userFactory;
});