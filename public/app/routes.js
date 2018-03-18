var app=angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider,$locationProvider){

	$routeProvider

	.when('/',{
		templateUrl:'app/views/pages/home.html'
	})

	.when('/register',{
		templateUrl:'app/views/pages/users/register.html',
		controller:'regCtrl',
		controllerAs:'register',
		autheticated:false
	})

	.when('/login',{
		templateUrl:'app/views/pages/users/login.html',
		autheticated:false
	})

	.when('/logout',{
		templateUrl:'app/views/pages/users/logout.html',
		autheticated:true
	})

	.when('/profile',{
		templateUrl:'app/views/pages/users/profile.html',
		autheticated:true,
		baseurl:''
	})

	.when('/create',{
		templateUrl:'app/views/blog/create.html'
	})

	.when('/activate/:token',{
		templateUrl:'app/views/pages/users/activation/activate.html',
		controller:'emailCtrl',
		controllerAs:'email',
		autheticated:false
	})

	.when('/resend',{
		templateUrl:'app/views/pages/users/activation/resend.html',
		controller:'resendCtrl',
		controllerAs:'resend'
	})

	.otherwise({
		redirectTo:'/'
	});

	$locationProvider.html5Mode({
		enabled:true,
		requireBase:false
	});
});

app.run(['$rootScope','Auth','$location',function($rootScope,Auth,$location){
	$rootScope.$on('$routeChangeStart',function(event,next,current){
		if(next.$$route.autheticated==true){
			if(!Auth.isLoggedIn()){
				baseurl=next.$$route.originalPath;
				event.preventDefault();
				$location.path('/login');
			}
		}
		else if(next.$$route.autheticated==false){
			if(Auth.isLoggedIn()){
				event.preventDefault();
				$location.path('/profile');
			}
		}
	});
}]);