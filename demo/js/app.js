var app = angular.module('agentsDesk', ['ngTable', 'infinite-scroll'])
    .controller('mainCtrl', function ($scope, $filter, ngTableParams, $http) {

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
            getData();
        }

        $scope.getMoreData = function () {
            $scope.data = $scope.clients.slice(0, $scope.data.length + 20);
        }
        
        var getData = function () {
            $http.get('js/clients.json').success(function (data) {
                $scope.clients = data.clients;
                console.log(data.clients.length);
                $scope.tableParams.reload();
            });
        }
        getData();
    });