angular.module('userApp',['loaderPage','ui.pagedown','appRoutes','userController','userServices','ngAnimate','mainController','authServices','emailController','fileModuleDirective','searchResult','uploadFileService'])

.config(function($httpProvider){
	$httpProvider.interceptors.push('authTokenInterceptor');
});