app.directive('infinite', function ($window, $timeout, bsLoadingOverlayService) {
    return {
        scope: {
            getData: '&',
            purgeData: '&',
            pageSize: '=',
            firstIndex: '='
        },
        restrict: 'A',
        link: function (scope, elem, attrs, window) {
            var PAGE_SIZE = scope.pageSize;
            var windowElement = angular.element($window);
            var scrollDelay = 300,
                scrollThrottleTimeout,
                throttled = false,
                scrollTop, //Current scrolled
                elementTopOffset, //Table offset from top
                rowHeight;
            var pixelsAboveCurrentTop, pixelsBelowCurrentBottom; //Table pixels
            var rowsAbove, rowsBelow;
            var pagesAbove, pagesBelow;
            var getRowsFromTotalHeight = function (totalHeight, rowHeight) {
                return Math.round(totalHeight / rowHeight);
            }
            var purgedOnce = false;
            var getPagesFromRows = function (page_size, rows) {
                return Math.floor(rows / page_size);
            }
            var fired = false;
            var calculate = function () {
                scrollTop = windowElement.scrollTop();
                pixelsAboveCurrentTop = scrollTop - elementTopOffset;
                pixelsBelowCurrentBottom = elementTopOffset + elem.height() - (scrollTop + windowElement.height());
                if (pixelsAboveCurrentTop > 0) {
                    rowsAbove = getRowsFromTotalHeight(pixelsAboveCurrentTop, rowHeight);
                    pagesAbove = getPagesFromRows(PAGE_SIZE, rowsAbove);
                    console.log("pages Above , rows above: " + pagesAbove + "," + rowsAbove);
                }
                if (pixelsBelowCurrentBottom > 0) {
                    rowsBelow = getRowsFromTotalHeight(pixelsBelowCurrentBottom, rowHeight);
                    pagesBelow = getPagesFromRows(PAGE_SIZE, rowsBelow);
                    //                    console.log("pages below , rows below: " + pagesBelow + "," + rowsBelow);
                }
            }
            $timeout(function () {
                elementTopOffset = elem.offset().top;
                rowHeight = elem.find("tr").height();
                console.log("Window Height: " + windowElement.height());
                console.log("Element height: " + elem.height());
                console.log("Element tag: " + elem.prop("tagName"));
                console.log("Row Height " + elem.find("tr").height());
                calculate();
            }, 500);


            var scrollHandler = function () {
                calculate();
                if (pagesBelow > 15) {
                    //                    remove excess from list
                    console.log("Purge Data now");
                    scope.purgeData({
                        value: false,
                        rows: null
                    });
                } else if (pagesBelow <= 5) {
                    console.log("Get Data now");
                    scope.getData({
                        value: true
                    });
                }
                if (pagesAbove > 30 || (pagesAbove < 4 && purgedOnce && scope.firstIndex > 0)) {

                    if (!fired) {
                        angular.element(document.querySelector('body')).addClass('stop-scrolling');
                        fired = true;
                        bsLoadingOverlayService.start({
                            referenceId: 'first'
                        });
                        if (pagesAbove > 30) {
                            scope.purgeData({
                                value: true,
                                rows: null
                            })
                            windowElement.scrollTop(scrollTop - rowHeight * PAGE_SIZE * 10);
                            purgedOnce = true;
                        } else if (pagesAbove < 4 && purgedOnce && scope.firstIndex > 0) {
                            scope.getData({
                                value: false
                            });
                            windowElement.scrollTop(scrollTop + rowHeight * PAGE_SIZE * 7);
                        }

                        setTimeout(function () {
                            angular.element(document.querySelector('body')).removeClass('stop-scrolling');
                            bsLoadingOverlayService.stop({

                                referenceId: 'first'
                            });
                            fired = false;
                        }, 2500);

                    }

                }
            }

            //requestAnimationFrame(repeatOften);
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