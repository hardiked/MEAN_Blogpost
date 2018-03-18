angular.module('mainController',['authServices'])

.controller('mainCtrl',function($window,$interval,$route,$rootScope,Auth,$scope,$location,$timeout){

	var app=this;
	$scope.textOnLogInButton="Login";
	app.loadme=false;

	app.checkSession=function(){
		if(Auth.isLoggedIn()){
			app.checkingSession=true;
			var interval=$interval(function(){
				var token=$window.localStorage.getItem('token');
				if(token==null){
					$interval.cancel(interval);
				}
				else{
					self.parseJwt=function(token){
						var base64Url=token.split('.')[1];
						var base64=base64Url.replace('-','+').replace('_','/');
						return JSON.parse($window.atob(base64));
					}
					var expireTime=self.parseJwt(token);
					var timeStamp=Math.floor(Date.now()/1000);
					var timeCheck=expireTime.exp-timeStamp;
					if(timeCheck<=0){
						$interval.cancel(interval);
					}
				}
			},2000);
		}
	};

	app.checkSession();

	$rootScope.$on('$routeChangeStart',function(){
		if(!app.checkingSession){
			app.checkSession();
		}
		app.errorMsg=false;
		if(Auth.isLoggedIn()){
			app.isLoggedIn=true;
			Auth.getUser().then(function(data){
				app.username=data.data.username;
				app.useremail=data.data.email;
				app.loadme=true;
			});
		}
		else{
			app.username='';
			app.isLoggedIn=false;
			app.loadme=true;
		}
	});

	
	this.doLogin=function(loginData){
		console.log("gr");
		console.log(app.loginData);
		$scope.textOnLogInButton="Verifying...";
		app.errorMsg=false;
		app.successMsg=false;
		app.warningMsg=false;
		app.expired=false;
		app.disabled=false;
		Auth.login(app.loginData).then(function(data){
			if(data.data.success==true){
				$scope.textOnLogInButton="Redirecting...";
				app.successMsg=data.data.message;
				$timeout(function(){
					$scope.textOnLogInButton="Login";
					$location.path('/');
					app.successMsg=false;
					app.checkSession();
				},2000)
			}
			else if(data.data.success==false){
				$scope.textOnLogInButton="Login";
				app.errorMsg=data.data.message;
			}
			else{
				app.expired=true;
				$scope.textOnLogInButton="Login";
				app.warningMsg=data.data.message;
				app.disabled=true;
			}
		});	
	}

	this.logout=function(){
		$location.path('/logout');
		Auth.logout();
		$timeout(function(){
			$location.path('/');
		},2000);
	}
});