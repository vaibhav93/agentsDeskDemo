app.directive('infinite', function ($window, $timeout) {
    return {
        scope: {
            track: '=?value'
        },
        restrict: 'A',
        link: function (scope, elem, attrs, window) {
            var windowElement = angular.element($window);
            var scrollDelay = 250,
                scrollThrottleTimeout,
                throttled = false,
                scrollTop,   //Current scrolled
                elementTopOffset, //Table offset from top
                rowHeight;
            var pixelsAboveCurrentTop, pixelsBelowCurrentBottom;  //Table pixels
            var rowsAbove,rowsBelow;
            var getRowsFromTotalHeight = function(totalHeight,rowHeight){
                return Math.round(totalHeight/rowHeight);
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
                }
                if(pixelsBelowCurrentBottom>0)
                    rowsBelow = getRowsFromTotalHeight(pixelsBelowCurrentBottom,rowHeight);
                console.log("rows Above : " + rowsAbove);
                console.log("rows Below: " + rowsBelow);
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