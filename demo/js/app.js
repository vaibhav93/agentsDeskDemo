var app = angular.module('agentsDesk', ['ngTable', 'infinite-scroll'])
    .controller('mainCtrl', function ($scope, $filter, ngTableParams, $http) {
        $scope.page_size = 10;
        $scope.clients = [];
        $scope.data = [];
        $scope.tableParams = new ngTableParams({
            page: 1,
            count: $scope.clients.length
        }, {
            counts: [],
            total: 1,
            getData: function ($defer, params) {
                $scope.data = params.sorting() ? $filter('orderBy')($scope.clients, params.orderBy()) : $scope.clients;
                $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
                if ($scope.data.length > 1)
                    $scope.data = $scope.data.slice(0, 20);
                $defer.resolve($scope.data);
            }
        });
        var firstIndex,lastIndex;
        function filterByEmail(value) {

            if (value.emails && value.emails[0].email && value.emails[0].email.indexOf($scope.searchParam) > -1) {
                return true;
            } else
                return false;
        }
        $scope.searchParam = '';

        $scope.runFilter = function () {
            $scope.clients = $scope.clients.filter(filterByEmail);
            console.log($scope.clients.length);
            $scope.tableParams.reload();
        }
        $scope.clearFilter = function () {
            $scope.searchParam = '';
        }

        $scope.getMoreData = function (direction) {
            console.log(direction);
            console.log('Getting Data');
            if (direction){ //Going down. add data below
                $scope.clients.push.apply($scope.clients, $scope.data.slice(lastIndex+1, lastIndex + $scope.page_size*3+1));
                lastIndex = lastIndex + $scope.page_size*3;
            }
            else{  //scroll up
//                $scope.clients.push.apply($scope.clients, $scope.data.slice($scope.clients.length, $scope.page_size));
            }

        }
        $scope.purgeData = function (direction) {
            console.log('Purging Data');
            if (!direction){ //going down. Delete rows on top
                console.log("Length before purging: "+$scope.clients.length);
                $scope.clients.splice(lastIndex-$scope.page_size+1, $scope.page_size);
                lastIndex = lastIndex - $scope.page_size;
                console.log("Length after purging: "+$scope.clients.length);
            }
//                $scope.clients.splice(0,$scope.page_size);
        }

        var getData = function () {
            $http.get('js/clients.json').success(function (data) {
                $scope.data = data.clients;
                
                $scope.clients = data.clients.splice(0, 100);
                firstIndex = 0;
                lastIndex = $scope.clients.length - 1 ;
            });
        }
        getData();
    });