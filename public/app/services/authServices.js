angular.module('authServices',[])

.factory('Auth',function($http,AuthToken){
	authFactory={};
	var baseurl;
	// User.create(regData)
	authFactory.login=function(loginData){
		return $http.post('/api/authenticate',loginData).then(function(data){
			AuthToken.setToken(data.data.token);
			return data;
		});
	};

	authFactory.email=function(token){
		AuthToken.setToken(token);
		return true;
	}

	authFactory.isLoggedIn=function(){
		if(AuthToken.getToken()){
			return true;
		}
		else{
			return false;
		}
	};

	authFactory.logout=function(){
		AuthToken.setToken();
	};

	authFactory.getUser=function(){
		if(AuthToken.getToken()){
			return $http.post('/api/me');
		}
		else{
			$q.reject({message:"User has no token"});
		}
	}


	return authFactory;
})

.factory('AuthToken',function($window){
	authTokenFactory={};

	authTokenFactory.setToken=function(token){
		if(token){
			$window.localStorage.setItem('token',token);
		}
		else{
			$window.localStorage.removeItem('token');
		}
	};

	authTokenFactory.getToken=function(){
		return $window.localStorage.getItem('token');
	}

	return authTokenFactory;
})

.factory('authTokenInterceptor',function(AuthToken){
	authInterceptorFactory={};

	authInterceptorFactory.request=function(config){
		var token=AuthToken.getToken();
		if(token){
			config.headers['x-access-token']=token;
		}
		return config;
	};

	return authInterceptorFactory;
});