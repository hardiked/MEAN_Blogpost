angular.module('userController',['userServices','fileModuleDirective'])

.controller('regCtrl',function(Auth,User,$timeout,$location,$http,$scope){

	var app=this;
	$scope.textOnSignUpButton="Register";
	
	this.regUser=function(regData,valid){
		$scope.textOnSignUpButton="Registering...";
		app.errorMsg=false;
		app.successMsg=false;
		app.warningMsg=false;

		if(valid && $scope.confirmed==true){
			User.create(app.regData).then(function(data){
				if(data.data.success){

					Auth.login(app.regData).then(function(data){
						if(data.data.success==true){
							$scope.textOnSignUpButton="Redirecting...";
							app.successMsg=data.data.message;
							$timeout(function(){
								$scope.textOnSignUpButton="Register";
								$location.path('/');
							},2000)
						}
						else if(data.data.success==false){
							$scope.textOnSignUpButton="Register";
							app.errorMsg=data.data.message;
						}
						else{
							$scope.textOnSignUpButton="Register";
							app.warningMsg=data.data.message;
						}
					});
				}
				else{
					$scope.textOnSignUpButton="Register";
					app.errorMsg=data.data.message;
				}
			});
		}
		else{
			$scope.textOnSignUpButton="Register";
			app.errorMsg="Please ensure that form is filled corredtly"
		}
	};

	this.checkUsername=function(regData){
		app.usernameMsg=false;
		app.className="success";
		app.usernameInvalid=false;
		app.checkingUsername=true;
		if(app.regData){
			if(app.regData.username && app.regData.username!=''){
				User.checkUsername(app.regData).then(function(data){
					if(data.data.success){
						app.checkingUsername=false;
						app.usernameInvalid=false;
						app.className="success";
						app.usernameMsg=data.data.message;
					}
					else{
						app.checkingUsername=false;
						app.usernameInvalid=true;
						app.className="error";
						app.usernameMsg=data.data.message;
					}
				});
			}
			else{
				app.checkingUsername=false;
			}
		}
		else{
			app.checkingUsername=false;
		}
	}

	this.checkEmail=function(regData){
		app.emailMsg=false;
		app.emailInvalid=false;
		app.checkingEmail=true;
		app.emailName="success";
		if(app.regData){
			console.log(app.regData);
			if(app.regData.email && app.regData.email!=""){
				User.checkEmail(app.regData).then(function(data){
					if(data.data.success){
						app.checkingEmail=false;
						app.emailInvalid=false;
						app.emailMsg=data.data.message;
						app.emailName="success";
					}
					else{
						app.checkingEmail=false;
						app.emailInvalid=true;
						app.emailMsg=data.data.message;
						app.emailName="error";
					}
				});
			}
			else{
				app.checkingEmail=false;
			}
		}
		else{
			app.checkingEmail=false;
		}
	}

})

.directive('match',function(){
	return {
		restrict:'A',
		controller:function($scope){

			$scope.confirmed=false;

			$scope.doConfirm=function(values){
				values.forEach(function(ele){
					if($scope.confirm==ele){
						$scope.confirmed=true;
					}
					else{
						$scope.confirmed=false;
					}
				});
			}
		},
		link:function(scope,element,attrs){
			attrs.$observe('match',function(){
				scope.matches=JSON.parse(attrs.match)
				scope.doConfirm(scope.matches);
			});
			scope.$watch('confirm',function(){
				scope.matches=JSON.parse(attrs.match)
				scope.doConfirm(scope.matches);
			});
		}
	};
})