app.directive('infinite', function ($window, $timeout) {
    return {
        scope: {
            getData: '&',
            purgeData: '&',
            pageSize: '='
        },
        restrict: 'A',
        link: function (scope, elem, attrs, window) {
            var PAGE_SIZE = scope.pageSize;
            var windowElement = angular.element($window);
            var scrollDelay = 250,
                scrollThrottleTimeout,
                throttled = false,
                scrollTop,   //Current scrolled
                elementTopOffset, //Table offset from top
                rowHeight;
            var pixelsAboveCurrentTop, pixelsBelowCurrentBottom;  //Table pixels
            var rowsAbove,rowsBelow;
            var pagesAbove,pagesBelow;
            var getRowsFromTotalHeight = function(totalHeight,rowHeight){
                return Math.round(totalHeight/rowHeight);
            }
            var getPagesFromRows = function(page_size,rows){
                return Math.floor(rows/page_size);
            }
            $timeout(function () {
                elementTopOffset = elem.offset().top;
                rowHeight = elem.find("tr").height();
                console.log("Window Height: " + windowElement.height());
                console.log("Element height: " + elem.height());
                console.log("Element tag: " + elem.prop("tagName"));
                console.log("Row Height " + elem.find("tr").height());
            }, 500);
            var scrollHandler = function () {
                scrollTop = windowElement.scrollTop();
                pixelsAboveCurrentTop = scrollTop - elementTopOffset;
                pixelsBelowCurrentBottom = elementTopOffset + elem.height() - (scrollTop + windowElement.height());
                if(pixelsAboveCurrentTop>0){
                    rowsAbove = getRowsFromTotalHeight(pixelsAboveCurrentTop,rowHeight);
                    pagesAbove = getPagesFromRows(PAGE_SIZE,rowsAbove);
                    console.log("pages Above , rows above: " + pagesAbove+","+rowsAbove);
                    if(pagesAbove>=3){
                        
                        //remove excess from list
                        //scope.purgeData({value:true});
                       // windowElement.scrollTop(scrollTop - PAGE_SIZE*rowHeight);
                    } else if(pagesAbove<=2){
                        //load more data
                       // scope.getData({value:false});
                    }
                }
                if(pixelsBelowCurrentBottom>0){
                    rowsBelow = getRowsFromTotalHeight(pixelsBelowCurrentBottom,rowHeight);
                    pagesBelow = getPagesFromRows(PAGE_SIZE,rowsBelow);
                    if(pagesBelow>10){
                        //remove excess from list
//                        console.log("Purge Data now");
                        scope.purgeData({value:false});
                    } else if(pagesBelow<=5){
                        //load more data
                        console.log("Get Data now");
                        scope.getData({value:true});
                    }
                }
                    
//                
//                console.log("pages Below: " + pagesBelow);
            }
            var throttleScroll = function () {
                if (!throttled) {
                    scrollHandler();
                    throttled = true;
                    scrollThrottleTimeout = $timeout(function () {
                        throttled = false;
                    }, scrollDelay);
                }
            };

            windowElement.on('scroll', throttleScroll);

        }
    }
});