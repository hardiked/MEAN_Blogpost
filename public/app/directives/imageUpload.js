angular.module('fileModuleDirective',[])

.directive('fileModel',['$parse',function($parse){
	return {
		restrict: 'A',
		link:function(scope,element,attrs){
			var parsedFile=$parse(attrs.fileModel);
			var parsedFleSetter=parsedFile.assign;
			element.bind('change',function(){
				scope.$apply(function(){
					parsedFleSetter(scope,element[0].files[0]);
				});
			});
		}
	};
}]);