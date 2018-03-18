angular.module('emailController',['userServices'])

.controller('emailCtrl',function($routeParams,User,$location,$timeout,Auth){
	app=this;
	User.activateAccount($routeParams.token).then(function(data){
		app.successMsg=false;
		app.errorMsg =false;
		if(data.data.success){
			app.successMsg=data.data.message+" Redirecting to home page";
					
			Auth.email(data.data.token);
			console.log(data.data.token);
			$timeout(function(){
				$location.path('/')
			},2000);
		}
		else{
			app.errorMsg =data.data.message;
			$timeout(function(){
				$location.path('/login')
			},2000);
		}
	});
})

.controller('resendCtrl',function($scope,User){
	$scope.textOnButton="submit";
	app=this;
	app.checkCredentials=function(loginData){
		$scope.textOnButton="sumitting...";
		app.errorMsg=false;
		app.successMsg=false;
		app.disabled=true;
		User.checkCredentials(app.loginData).then(function(data){
			$scope.textOnButton="Checking Credentials...";
			if(data.data.success==true){
				$scope.textOnButton="submit";
				User.resendLink(app.loginData).then(function(data){
					app.successMsg=data.data.message;
					console.log(data);
				});
			}
			else if(data.data.success==false){
				app.disabled=false;
				$scope.textOnButton="submit";
				app.errorMsg=data.data.message;
			}
			else{
				app.disabled=true;
				$scope.textOnButton="submit";
				app.errorMsg=data.data.message;
			}
		});
	}
});