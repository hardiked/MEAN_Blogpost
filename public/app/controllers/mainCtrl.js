angular.module('mainController',['ngSanitize','authServices','uploadFileService','ui.pagedown'])


.controller("createCtrl", function($scope,$window,$q,$http,$rootScope) {
  $scope.empty=true;
  $scope.var1 = $window.var1;
  $scope.data = {
    content: "",
    placeholder: "Write your story here.."
  };

  $scope.search=function($event){
  	    if($scope.data.content!="" && $scope.title!=""){
  	    	$scope.empty=false;
  	    }
  	    else{
  	    	$scope.empty=true;
  	    }
		$http.post('/api/render',{body:$scope.data.content}).then(function(data){
			$scope.blog=data.data.b;
		});
	}
	$scope.createBlog=function(){
		$rootScope.searching=true;
		$http.post('/api/blog',{title:$scope.title,body:$scope.data.content,username:$rootScope.username}).then(function(data){
			if(data.data.success==false){
				$scope.class="error";
				$scope.blogMessage=data.data.message;
			}
			else{
				$scope.title="";
				$scope.data.content="";
				$scope.class="success";
				$scope.blogMessage=data.data.message;
				$scope.blog=data.data.b;
			}
			$rootScope.searching=false;
		});
	}
  
  $scope.promptImageUrl=function promptImageUrl(){
  	console.log("fe");
  }

  $scope.showSomeHelp = function showSomeHelp() {
    // this is what the default will do
    $window.open("http://daringfireball.net/projects/markdown/syntax", "_blank");
  };
  
  $scope.insertImage = function insertImage(image) {
    var deferred = $q.defer();
    
    // or you can return a string straightaway
    deferred.resolve(image);
    
    return deferred.promise;
  };
  
})

.controller('imageCtrl',function( $routeParams,$rootScope,$scope,uploadFile,$http,$timeout){
	$scope.file={};
	$scope.uploading=false;
	$scope.selected=false;
	$scope.arrow=false;



	$http.post('/api/profile/'+$routeParams.username).then(function(data){
		console.log(data);
		$scope.name=data.data.username;
		$scope.mail=data.data.email;
		$scope.pic=data.data.profile
	});



	$scope.Submit=function(){
		$scope.uploading=true;
		uploadFile.upload($scope.file).then(function(data){
			if(data.data.success){
				// $scope.class="green-text";
				// $scope.profileMessage=data.data.message;
				$rootScope.profile=data.data.filename;
				$scope.pic=data.data.filename;
				$http.put('/api/updateprofile',{"username":$rootScope.username,"profile":$rootScope.profile}).then(function(data){
					$rootScope.profile=data.data.profile;
					$scope.pic=data.data.profile;
					$scope.uploading=false;
					$scope.arrow=false;
				});
				$scope.file={};
				$scope.selected=false;
				var $toastContent = $('<span>Profile picture successfully updated</span>');
  				Materialize.toast($toastContent, 4000);
			}
			else{
				$scope.selected=false;
				// $scope.class="red-text";
				// $scope.profileMessage=data.data.message;
				$scope.file={};
				$scope.uploading=false;
				var $toastContent = $('<span>Invalid file format</span>');
  				Materialize.toast($toastContent, 4000);
			}
		});
	};

	$scope.profileChanged=function(files){
		if(files.length>0 && files[0].name.match(/\.(png|jpg|jpeg)$/)){
			$scope.selected=true;
			$scope.arrow=true;
			$scope.profileMessage="";
			var fileReader=new FileReader();
			fileReader.readAsDataURL(files[0]);
			fileReader.onload=function(e){
				$timeout(function() {
					$scope.thumbnail={};
					$scope.thumbnail.dataUrl=e.target.result;
				},10);
			};
		}
		else{
			$scope.thumbnail={};
			var $toastContent = $('<span>Invalid file format</span>');
  			Materialize.toast($toastContent, 4000,'rounded');
		}
	};

	

})

.controller('mainCtrl',function($http,$window,$interval,$route,$rootScope,Auth,$scope,$location,$timeout){
	$rootScope.searching=false;
	var app=this;
	$scope.textOnLogInButton="Login";
	app.loadme=false;

	$http.get('/api/blog').then(function(data){
		console.log(data);
		if(data.data.success){
			$scope.blogList=data.data.blog;
			console.log($scope.blogList);
		}
	});

	$scope.rub=function($event){
		$scope.searchkey="";
		$rootScope.hits="";
	}

	$scope.search=function($event){
		$rootScope.searching=true;
		if($scope.searchkey!=undefined && $scope.searchkey!=null){
			console.log($scope.searchkey);
			$http.post('/api/search',{"query":$scope.searchkey}).then(function(data){
				if(data.data.hits.length!=0){
					$rootScope.hits=data.data.hits;
				}
				$rootScope.searching=false;
			});
		}
		else{
			$rootScope.hits="";
			$rootScope.searching=false;
		}
	};

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
		$rootScope.hits="";
		if(!app.checkingSession){
			app.checkSession();
		}
		app.errorMsg=false;
		if(Auth.isLoggedIn()){
			app.isLoggedIn=true;
			Auth.getUser().then(function(data){
				$rootScope.username=data.data.username;
				var user=data.data.username;
				console.log(user);
				$http.post('/api/getprofile',{"username":user}).then(function(data){
					$rootScope.profile=data.data.profile;
					// console.log($rootScope.profile);
				});
				app.useremail=data.data.email;
				app.loadme=true;
			});
		}
		else{
			$rootScope.username='';
			app.isLoggedIn=false;
			app.loadme=true;
		}
		
	});

	
	this.doLogin=function(loginData){
		console.log("gr");
		$scope.textOnLogInButton="Verifying...";
		app.errorMsg=false;
		app.successMsg=false;
		app.warningMsg=false;
		app.expired=false;
		app.disabled=false;
		Auth.login(app.loginData).then(function(data){
			if(data.data.success==true){
				$rootScope.profile=data.data.profile;
				console.log($rootScope.profile)
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