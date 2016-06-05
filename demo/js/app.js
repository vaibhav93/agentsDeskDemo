var app = angular.module('agentsDesk', ['bsLoadingOverlay'])
    .controller('mainCtrl', function ($scope, $filter, $http, bsLoadingOverlayService) {
        $scope.page_size = 10;
        $scope.clients = [];
        $scope.data = [];

        var lastIndex;

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
            //            console.log(direction);
            //            console.log('Getting Data');
            if (direction) { //Going down. add data below
                console.log("length before adding:" + $scope.clients.length);
                $scope.clients.push.apply($scope.clients, $scope.data.slice(lastIndex + 1, lastIndex + $scope.page_size * 3 + 1));
                console.log("length after adding:" + $scope.clients.length);
                lastIndex = lastIndex + $scope.page_size * 3;
            } else { //scroll up
                if ($scope.firstIndex > 0) {
                    var start = $scope.firstIndex - $scope.page_size * 7
                    if (start < 0)
                        start = 0;
                    console.log("start at:" + start + " end at " + $scope.firstIndex);
                    // console.log($scope.data);
                    $scope.clients.unshift.apply($scope.clients, $scope.data.slice(start, $scope.firstIndex));
                    $scope.firstIndex = $scope.firstIndex - $scope.page_size * 7;
                    console.log("First Index:" + $scope.firstIndex);
                    if ($scope.firstIndex < 0)
                        $scope.firstIndex = 0;
                }
            }

        }
        $scope.purgeData = function (direction, rows) {

            if (direction) { //going down. Delete rows on top
                console.log($scope.clients.length);
                $scope.clients.splice(0, $scope.page_size * 10);
                $scope.firstIndex = $scope.firstIndex + $scope.page_size * 10;
                console.log("first index:" + $scope.firstIndex);
                //                console.log($scope.clients);
                console.log("purgin ablove");
            } else {
                //                console.log("Length before purging: "+$scope.clients.length);
                $scope.clients.splice(lastIndex - $scope.page_size * 3 + 1, $scope.page_size * 3);
                lastIndex = lastIndex - $scope.page_size * 3;
                //                console.log("Length after purging: "+$scope.clients.length);
            }
            //                $scope.clients.splice(0,$scope.page_size);
        }

        var getData = function () {
            $http.get('js/clients.json').success(function (data) {
                $scope.data = data.clients;
                $scope.clients = data.clients.slice(0, 501);
                console.log("Length:" + $scope.clients.length);
                $scope.firstIndex = 0;
                lastIndex = $scope.clients.length - 1;
            });
        }
        getData();
    });