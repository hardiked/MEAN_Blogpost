angular.module('searchResult',[])

.directive('searchResult',['$parse','$rootScope',function($parse,$rootScope){
	return {
			template:"<div ng-repeat='i in hits'><div class='col s12 m7'><div class='card horizontal'><div class='card-image'><img ng-src='http://localhost:8080/api/profiles/{{hits[hits.indexOf(i)]._source.profile}}'></div><div class='card-stacked'><div class='card-content'><p style='color:black;'>{{hits[hits.indexOf(i)]._source.email}}<br>{{hits[hits.indexOf(i)]._source.username}}</p></div></div></div></div></div>"
		};
}]);