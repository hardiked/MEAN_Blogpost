angular.module('userApp',['appRoutes','userController','userServices','ngAnimate','mainController','authServices','emailController','fileModuleDirective'])

.config(function($httpProvider){
	$httpProvider.interceptors.push('authTokenInterceptor');
});